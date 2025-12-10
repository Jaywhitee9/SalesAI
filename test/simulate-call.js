const WebSocket = require('ws');
const uuid = require('uuid');

const WS_URL = 'ws://localhost:3000/twilio-stream';

// MOCK PAYLOAD
const MOCK_PAYLOAD = Buffer.alloc(160).toString('base64');

const callSid = 'CA_TEST_123'; // Fixed SID for easier frontend testing
const streamSid = `MZ${uuid.v4()}`;

function runTest() {
    console.log('Connecting to:', WS_URL);
    const ws = new WebSocket(WS_URL);

    ws.on('open', () => {
        console.log('[Test] Connected to Twilio Endpoint');
        console.log(`[Test] Call CID: ${callSid}`);
        console.log('--- OPEN BROWSER NOW: http://localhost:3000/?callSid=CA_TEST_123 ---');
        console.log('--- You have 10 seconds before media starts... ---');

        const startMsg = {
            event: "start",
            start: {
                streamSid,
                callSid,
                tracks: ["inbound", "outbound"]
            }
        };
        ws.send(JSON.stringify(startMsg));
        console.log('[Test] Sent Start event');

        // Wait 10s for user to open browser
        setTimeout(() => {
            console.log('[Test] Starting Media Stream (Simulating conversation)...');

            let packets = 0;
            const interval = setInterval(() => {
                if (packets >= 50) { // Longer duration for demo
                    clearInterval(interval);
                    ws.send(JSON.stringify({ event: "stop" }));
                    console.log('[Test] Sent Stop event');
                    ws.close();
                    return;
                }

                const mediaMsg = {
                    event: "media",
                    media: {
                        track: packets % 2 === 0 ? "inbound" : "outbound",
                        payload: MOCK_PAYLOAD
                    }
                };
                ws.send(JSON.stringify(mediaMsg));
                packets++;
            }, 500); // Slower pace (2 packets/sec)
        }, 10000);
    });

    ws.on('message', (data) => {
        // We don't expect messages BACK on the Twilio socket usually,
        // unless we implemented <Stream> bidirectionality (not in this scope).
        console.log('[Test] Received:', data.toString());
    });

    ws.on('close', () => {
        console.log('[Test] Disconnected');
    });

    ws.on('error', (err) => {
        console.error('[Test] Error:', err.message);
    });
}

runTest();
