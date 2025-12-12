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
    root: path.join(__dirname, '../client/dist'),
    prefix: '/',
});

// SPA Fallback: Redirect all 404s (non-API) to index.html
fastify.setNotFoundHandler((request, reply) => {
    if (request.raw.url.startsWith('/api')) {
        reply.code(404).send({ error: 'Endpoint not found' });
    } else {
        reply.sendFile('index.html');
    }
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
