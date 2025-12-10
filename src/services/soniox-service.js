const WebSocket = require('ws');

const SONIOX_URL = 'wss://stt-rt.soniox.com/transcribe-websocket';

class SonioxService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        if (!this.apiKey) {
            console.error('[Soniox] CRITICAL: SONIOX_API_KEY is missing! Transcription will fail.');
        }
    }

    createSession(callSid, track, onTranscript) {
        // track is 'inbound' (customer) or 'outbound' (agent)

        // Config as requested
        const model = process.env.SONIOX_MODEL || "en_v2_lowlatency";

        // Config matching Soniox v3 Real-time docs
        const config = {
            api_key: this.apiKey,
            model: "stt-rt-v3",

            // Audio format
            audio_format: "mulaw",
            sample_rate: 8000,
            num_channels: 1,

            // Languages: Hebrew + English
            language_hints: ["he", "en"],
            enable_language_identification: true,

            // Features
            enable_endpoint_detection: true,
            enable_speaker_diarization: false // We handle speaker separation via Twilio tracks (agent vs customer stream)
        };

        const ws = new WebSocket(SONIOX_URL);

        // Maintain local transcript state for this stream to handle deduping if needed locally,
        // although the CallManager handles the detailed aggregation. 
        // Soniox sends absolute offsets or incremental updates.
        // We will trust the `is_final` flag and the text provided.

        ws.on('open', () => {
            console.log(`[Soniox] Opening stream for ${callSid} (${track}) using model: ${model}`);
            // Send config immediately
            ws.send(JSON.stringify(config));
        });

        ws.on('message', (data) => {
            try {
                const response = JSON.parse(data);

                // Error handling
                if (response.error_code) {
                    console.error(`[Soniox] API Error for ${callSid} (${track}): ${response.error_code} - ${response.error_message}`);
                    return;
                }

                if (!response.tokens) return;

                // Separate Final and Non-Final tokens
                const finalTokens = response.tokens.filter(t => t.is_final);
                const nonFinalTokens = response.tokens.filter(t => !t.is_final);

                // 1. Emit Final Text (if any)
                if (finalTokens.length > 0) {
                    const finalText = finalTokens.map(t => t.text).join("");
                    if (finalText) {
                        onTranscript(finalText, true);
                    }
                }

                // 2. Emit Non-Final Text (if any)
                // Note: Soniox sends the FULL accumulating partial in non-final tokens usually, 
                // or we might need to accumulate. 
                // According to docs "Non-final tokens update as more audio arrives; reset them on every response."
                // So simply joining them is the current partial state.
                if (nonFinalTokens.length > 0) {
                    const partialText = nonFinalTokens.map(t => t.text).join("");
                    if (partialText) {
                        onTranscript(partialText, false);
                    }
                }

            } catch (e) {
                console.error(`[Soniox] Error parsing message for ${callSid}:`, e);
            }
        });

        ws.on('error', (err) => {
            console.error(`[Soniox] Error for ${callSid} (${track}):`, err.message);
            // Don't throw, just log. The session might be dead but keep the stream alive.
        });

        ws.on('close', () => {
            console.log(`[Soniox] Closed for ${callSid} (${track})`);
        });

        return {
            sendAudio: (audioPayload) => {
                if (ws.readyState === WebSocket.OPEN) {
                    // Send raw binary or hex? 
                    // Usually STT websockets expect binary or JSON wrapped.
                    // Soniox docs: Binary messages for audio.
                    ws.send(audioPayload);
                }
            },
            close: () => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            }
        };
    }
}

module.exports = new SonioxService(process.env.SONIOX_API_KEY);
