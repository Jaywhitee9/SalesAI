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
        const config = {
            api_key: this.apiKey,
            audio_format: "mulaw",
            sample_rate: 8000,
            num_channels: 1,
            include_non_final: true,
            model: "en_v2" // Required by Soniox. Using English to verify pipeline first.
        };

        const ws = new WebSocket(SONIOX_URL);

        // Maintain local transcript state for this stream to handle deduping if needed locally,
        // although the CallManager handles the detailed aggregation. 
        // Soniox sends absolute offsets or incremental updates.
        // We will trust the `is_final` flag and the text provided.

        ws.on('open', () => {
            console.log(`[Soniox] Connected for ${callSid} (${track})`);
            // Send config immediately
            ws.send(JSON.stringify(config));
        });

        ws.on('message', (data) => {
            try {
                const response = JSON.parse(data);
                // Valid response structure typically has 'text' and 'is_final' (or 'type': 'partial'/'final')
                // Adhere to Soniox API docs structure.

                // For Soniox, standard response: { text: "...", is_final: boolean, ... }
                console.log('[Soniox] Raw:', JSON.stringify(response).substring(0, 200));
                console.log('[Soniox] Response:', JSON.stringify(response));

                if (response.text) {
                    onTranscript(response.text, response.is_final);
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
