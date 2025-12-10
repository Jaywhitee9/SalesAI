const CallManager = require('../services/call-manager');
const SonioxService = require('../services/soniox-service');
const CoachingEngine = require('../services/coaching-engine');
const TenantStore = require('../services/tenant-store');

async function registerTwilioRoutes(fastify) {

    // 1. HTTP Endpoint for Inbound/Outbound Calls
    // 1. HTTP Endpoint for Inbound/Outbound Calls
    const voiceHandler = async (request, reply) => {
        const baseUrl = process.env.PUBLIC_URL || `https://${request.headers.host}`;
        const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');

        // "To" parameter indicates an outbound call attempt or the number dialed
        const { To } = request.body || request.query;

        reply.type('text/xml');

        let response;
        try {
            const VoiceResponse = require('twilio').twiml.VoiceResponse;
            response = new VoiceResponse();

            // 1. GREETING (Hebrew)
            response.say({
                language: 'he-IL',
                voice: 'alice' // or a specific neural voice if available
            }, 'שלום, הגעתם למאמן המכירות. השיחה מוקלטת לצורך שיפור השירות.');

            // 2. FORK AUDIO to AI (WebSocket)
            const start = response.start();
            start.stream({
                url: `${wsUrl}/twilio-stream`,
                track: 'both_tracks'
            });

            // 3. DIAL LOGIC
            // Normalize "To" number to E.164 if dealing with Israeli numbers
            let targetNumber = To;
            if (targetNumber) {
                // Remove non-digits
                let cleanNumber = targetNumber.replace(/\D/g, '');
                // If starts with 0 and is long enough, assume IL local
                if (targetNumber.startsWith('0') && cleanNumber.length >= 9) {
                    targetNumber = '+972' + cleanNumber.substring(1);
                } else if (!targetNumber.startsWith('+') && cleanNumber.length >= 7) {
                    // Try to be smart? Or just let it fail if not +
                    // Let's assume input might be 501234567 -> +972501234567 if they omitted 0? 
                    // Safer to just handle the standard '05...' case.
                }
            }

            if (targetNumber && targetNumber !== process.env.TWILIO_PHONE_NUMBER) {
                // Outbound or forwarding
                const dial = response.dial({
                    callerId: process.env.TWILIO_PHONE_NUMBER,
                    answerOnBridge: true
                });
                dial.number(targetNumber);
            } else {
                // Inbound to system
                response.say('. אנא המתינו לנציג.');
                // In a real app we might put them in a queue or just keep the stream open
                response.pause({ length: 10 });
            }

            console.log('[Twilio] Generated TwiML:', response.toString());
            return response.toString();

        } catch (error) {
            console.error('[Twilio] Error generating TwiML:', error);
            // Fallback TwiML to avoid "Application Error"
            return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say>Sorry, an error occurred in the system.</Say>
</Response>`;
        }
    };

    fastify.post('/voice', voiceHandler);
    fastify.get('/voice', voiceHandler);

    // 2. WebSocket Endpoint for Media Stream
    fastify.get('/twilio-stream', { websocket: true }, (connection, req) => {
        console.log('[Twilio] Stream connected');
        const ws = connection.socket || connection;

        let callSid = null;
        let streamSid = null;

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);

                if (data.event === 'start') {
                    callSid = data.start.callSid;
                    streamSid = data.start.streamSid;

                    // --- DETERMINISTIC CONTEXT RESOLUTION ---
                    // Resolve Account/Agent based on call params (From/To)
                    // In a real scenario, data.start.customParameters or From/To would be used
                    // We'll mock it using the TenantStore

                    // Mocking the 'From' param for demo purposes since we don't have it easily in start event
                    // typically checking `data.start.customParameters` or internal lookup map
                    let context;
                    try {
                        context = TenantStore.resolveContext({ From: 'default' }); // Force default for now
                    } catch (e) {
                        console.error(`[Twilio] Failed to resolve context: ${e.message}`);
                        ws.close();
                        return;
                    }

                    console.log(`[Twilio] Stream started for CallSid: ${callSid} [Tenant: ${context.account.name}]`);

                    // Initialize Call State WITH CONTEXT
                    const call = CallManager.getCall(callSid, context);

                    // --- CRITICAL: OPEN DUAL SONIOX SESSIONS ---
                    // 1) Inbound (Customer)
                    call.sonioxSockets.inbound = SonioxService.createSession(callSid, 'inbound', (text, isFinal) => {
                        handleTranscript(callSid, 'inbound', text, isFinal);
                    });

                    // 2) Outbound (Agent)
                    call.sonioxSockets.outbound = SonioxService.createSession(callSid, 'outbound', (text, isFinal) => {
                        handleTranscript(callSid, 'outbound', text, isFinal);
                    });

                } else if (data.event === 'media') {
                    const track = data.media.track;
                    const payload = data.media.payload; // Base64 audio

                    if (callSid) {
                        const call = CallManager.getCall(callSid); // Context already set

                        if (track === 'inbound' && call.sonioxSockets.inbound) {
                            call.sonioxSockets.inbound.sendAudio(Buffer.from(payload, 'base64'));
                        } else if (track === 'outbound' && call.sonioxSockets.outbound) {
                            call.sonioxSockets.outbound.sendAudio(Buffer.from(payload, 'base64'));
                        }
                    }

                } else if (data.event === 'stop') {
                    console.log(`[Twilio] Stream stopped for ${callSid}`);
                    CallManager.cleanupCall(callSid);
                }
            } catch (e) {
                console.error('[Twilio] Error processing message:', e);
            }
        });

        ws.on('close', () => {
            console.log(`[Twilio] Socket closed for ${callSid}`);
            if (callSid) CallManager.cleanupCall(callSid);
        });
    });

    // Helper to process transcripts
    const handleTranscript = async (callSid, role, text, isFinal) => {
        try {
            // Safely check if call exists before processing (Soniox might send trailing messages)
            // We catch getCall errors implicitly or explicit check
            // CallManager.getCall will throw if call is missing and no context provided

            // 1. Update State & Broadcast to UI (Transcript)
            CallManager.addTranscript(callSid, role, text, isFinal);

            // 2. Trigger Coaching Logic
            // --- CRITICAL: TRIGGER CONDITIONS ---
            // a) Must be FINAL
            // b) Must be CUSTOMER (inbound)
            if (isFinal && role === 'inbound') {
                const call = CallManager.getCall(callSid);
                const account = TenantStore.getAccount(call.accountId);

                const history = call.transcripts;

                // Merge and sort context
                const mixedHistory = [
                    ...history.customer.map(t => ({ role: 'customer', text: t.text, timestamp: t.timestamp })),
                    ...history.agent.map(t => ({ role: 'agent', text: t.text, timestamp: t.timestamp }))
                ].sort((a, b) => a.timestamp - b.timestamp);

                // Take last 10
                const recentContext = mixedHistory.slice(-10);

                const advice = await CoachingEngine.generateCoaching(call, account.config, recentContext);

                if (advice) {
                    // Update State
                    call.lastCoachingTime = Date.now();
                    call.coachingHistory.push({
                        type: advice.type,
                        message: advice.message,
                        timestamp: Date.now()
                    });

                    // Broadcast coaching to UI (Standardized Contract)
                    CallManager.broadcastToFrontend(callSid, {
                        type: 'coaching',
                        severity: advice.severity || 'info', // Default if missing
                        role: 'system', // It's from the system
                        message: advice.message,
                        suggested_reply: advice.suggested_reply
                    });
                }
            }
        } catch (err) {
            console.warn(`[Handler] Error processing transcript for ${callSid} (Call likely ended):`, err.message);
        }
    };
}

module.exports = registerTwilioRoutes;
