import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './router.js';
import { serverConfig } from '@fsapp/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './db/schema.js';

export type DrizzleClient = PostgresJsDatabase<typeof schema>;

async function main() {
    const server = Fastify({ logger: true });
    const db = drizzle(serverConfig.POSTGRES_URL!, { schema, logger: true });

    await server.register(cors, { origin: true, credentials: true });

    await server.register(fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: {
            router: appRouter,
            createContext: async () => ({ db }),
        },
    });

    server.get('/healthz', async () => ({ ok: true }));

    // Gracefully close DB connection on server shutdown
    server.addHook('onClose', async () => {
        await db.$client.end();
    });

    const port = Number(serverConfig.PORT);
    const host = serverConfig.HOST;
    await server.listen({ port, host });
    server.log.info(`API listening on http://${host}:${port}`);
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});


