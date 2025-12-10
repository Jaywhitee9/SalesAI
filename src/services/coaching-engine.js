const OpenAI = require("openai");

class CoachingEngine {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "_DUMMY_API_KEY_",
            baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
        });
    }

    /**
     * Main entry point for generating coaching
     * @param {Object} callState - The full call state object
     * @param {Object} accountConfig - The tenant's configuration object
     * @param {Array} conversationHistory - Sorted array of {role, text}
     */
    async generateCoaching(callState, accountConfig, conversationHistory) {
        const { callSid, lastCoachingTime, coachingHistory } = callState;
        const { coachingResponseTime, maxTipsPerCall, systemPrompt, rules } = accountConfig;

        // --- 1. FREQUENCY CHECK ---
        const now = Date.now();
        if (now - lastCoachingTime < coachingResponseTime) {
            console.log(`[Coaching] Skipped for ${callSid}: Cooldown active`);
            return null;
        }

        // --- 2. MAX TIPS CHECK ---
        if (coachingHistory.length >= maxTipsPerCall) {
            console.log(`[Coaching] Skipped for ${callSid}: Max tips reached`);
            return null;
        }

        // --- 3. CONTEXT PREPARATION ---
        // Format conversation for LLM
        const conversationText = conversationHistory
            .map((entry) => `${entry.role.toUpperCase()}: ${entry.text}`)
            .join("\n");

        const historySummary = coachingHistory
            .map(h => `[Previous Advice]: ${h.message}`)
            .join("\n");

        const fullSystemPrompt = `${systemPrompt}

RULES:
1. Return JSON ONLY.
2. 'severity' must be one of: "info", "warning", "critical".
3. 'type' must be one of: "reply_suggestion", "objection", "compliance".
4. 'message' is a short explanation for the agent.
5. 'suggested_reply' is what the agent should say (in the target language).
6. Do NOT repeat previous advice.

PREVIOUS ADVICE GIVEN (Avoid repeating):
${historySummary}
`;

        try {
            // --- 4. LLM CALL ---
            const response = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: fullSystemPrompt },
                    { role: "user", content: `Conversation:\n${conversationText}` },
                ],
                response_format: { type: "json_object" },
                max_tokens: 200,
                temperature: 0.3, // Low temperature for determinism
            });

            const content = response.choices[0].message.content;
            let advice;
            try {
                advice = JSON.parse(content);
            } catch (e) {
                console.error(`[Coaching] Failed to parse JSON for ${callSid}`, content);
                return null; // Fail safe
            }

            // --- 5. VALIDATION & POST-PROCESSING ---
            if (!advice.message || !advice.suggested_reply) {
                return null; // Invalid structure
            }

            // Duduplication check (simple text overlap)
            const isDuplicate = coachingHistory.some(h => h.message === advice.message);
            if (isDuplicate) {
                console.log(`[Coaching] Skipped duplicate advice for ${callSid}`);
                return null;
            }

            console.log(`[Coaching] Generated advice for ${callSid}: ${advice.type}`);
            return advice;

        } catch (err) {
            console.error(`[Coaching] Error generating advice:`, err);
            return null;
        }
    }
}

module.exports = new CoachingEngine();
