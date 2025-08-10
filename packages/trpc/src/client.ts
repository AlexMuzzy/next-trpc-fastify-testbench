import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@fsapp/server/router';
import superjson from 'superjson';
import { serverConfig } from '@fsapp/config';

export const trpc = createTRPCReact<AppRouter>({});

export const createClient = (opts?: { apiUrl?: string }) =>
    trpc.createClient({
        links: [
            loggerLink({ enabled: () => typeof window !== 'undefined' }),
            httpBatchLink({ url: `${opts?.apiUrl ?? `http://${serverConfig.HOST}:${serverConfig.PORT}`}/trpc`, transformer: superjson }),
        ],
    });


