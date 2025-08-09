import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './router';

async function main() {
    const server = Fastify({ logger: true });

    await server.register(cors, { origin: true, credentials: true });

    await server.register(fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: {
            router: appRouter,
            createContext: async () => ({ userId: null }),
        },
    });

    server.get('/healthz', async () => ({ ok: true }));

    const port = Number(process.env.PORT ?? 4000);
    const host = process.env.HOST ?? '0.0.0.0';
    await server.listen({ port, host });
    server.log.info(`API listening on http://${host}:${port}`);
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});


