import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@fsapp/server/router';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>({});

export const createClient = (opts?: { apiUrl?: string }) =>
    trpc.createClient({
        links: [
            loggerLink({ enabled: () => typeof window !== 'undefined' }),
            httpBatchLink({ url: `${opts?.apiUrl ?? `http://localhost:4000`}/trpc`, transformer: superjson }),
        ],
    });


