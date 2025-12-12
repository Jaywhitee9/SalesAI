require('dotenv').config();
const fastify = require('fastify')({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
});
const fastifyWs = require('@fastify/websocket');
const fastifyFormBody = require('@fastify/formbody');
const fastifyStatic = require('@fastify/static');
const path = require('path');

// Register plugins
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/', // optional: default '/'
});

// Import Routes
const registerTwilioRoutes = require('./routes/twilio-handler');
const registerClientRoutes = require('./routes/client-socket');
const registerOutboundRoutes = require('./routes/outbound-call');

// Register Routes
fastify.register(async function (fastify) {
    await registerTwilioRoutes(fastify);
    await registerClientRoutes(fastify);
    await registerOutboundRoutes(fastify);
    await require('./routes/token-handler')(fastify);
});

fastify.get('/health', async (request, reply) => {
    return { status: 'ok', uptime: process.uptime() };
});

// Comprehensive system health check
fastify.get('/api/health', async (request, reply) => {
    const results = {
        server: { status: 'ok', uptime: Math.floor(process.uptime()) },
        twilio: { status: 'unknown', message: '' },
        soniox: { status: 'unknown', message: '' },
        openai: { status: 'unknown', message: '' }
    };

    // Check Twilio
    try {
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            results.twilio = { status: 'not_configured', message: 'API keys missing' };
        } else {
            const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            const account = await twilio.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
            results.twilio = { status: 'ok', message: `Connected: ${account.friendlyName}` };
        }
    } catch (e) {
        results.twilio = { status: 'error', message: e.message };
    }

    // Check Soniox
    try {
        if (!process.env.SONIOX_API_KEY) {
            results.soniox = { status: 'not_configured', message: 'API key missing' };
        } else {
            // Simple check - just verify key exists (actual WS test would be complex)
            results.soniox = { status: 'ok', message: 'API key configured' };
        }
    } catch (e) {
        results.soniox = { status: 'error', message: e.message };
    }

    // Check OpenAI
    try {
        const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
        const baseUrl = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || process.env.OPENAI_BASE_URL;

        if (!apiKey) {
            results.openai = { status: 'not_configured', message: 'API key missing' };
        } else {
            const OpenAI = require('openai');
            const openai = new OpenAI({ apiKey, baseURL: baseUrl });

            // Quick test - list models (lightweight call)
            await openai.models.list();
            results.openai = { status: 'ok', message: baseUrl ? `Connected via ${baseUrl}` : 'Connected to OpenAI' };
        }
    } catch (e) {
        results.openai = { status: 'error', message: e.message.substring(0, 100) };
    }

    return results;
});

// Note: The root '/' route is now handled by fastifyStatic (index.html)

// SPA Fallback: Serve index.html for any 404 that isn't an API call
fastify.setNotFoundHandler((request, reply) => {
    if (request.raw.url.startsWith('/api')) {
        reply.status(404).send({ error: 'Not Found', url: request.raw.url });
    } else {
        reply.sendFile('index.html');
    }
});

const detectNgrokUrl = require('./utils/ngrok-detector');

const start = async () => {
    try {
        // --- AUTO DETECT NGROK (PRIORITY) ---
        // If ngrok is running, we assume we are in local dev and want to use it,
        // even if .env has a production URL.
        const ngrokUrl = await detectNgrokUrl();
        if (ngrokUrl) {
            process.env.PUBLIC_URL = ngrokUrl;
            fastify.log.info(`[Ngrok] Auto-detected Public URL: ${ngrokUrl} (Overriding env)`);
        } else if (!process.env.PUBLIC_URL) {
            fastify.log.warn('[Ngrok] Could not detect public URL and PUBLIC_URL not set.');
        } else {
            fastify.log.info(`[Config] Using configured Public URL: ${process.env.PUBLIC_URL}`);
        }

        const PORT = process.env.PORT || 3000;
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        fastify.log.info(`Server listening on ${PORT}`);

        // --- CONFIG CHECK ---
        if (!process.env.SONIOX_API_KEY) {
            fastify.log.error('!!! MISSING SONIOX_API_KEY !!! Voice transcription will not work.');
        }

    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    fastify.log.info('SIGINT received. Shutting down...');
    await fastify.close();
    process.exit(0);
});

start();
