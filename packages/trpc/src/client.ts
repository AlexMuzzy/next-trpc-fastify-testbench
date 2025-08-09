import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@fsapp/server/router';

export const trpcReact = createTRPCReact<AppRouter>({});

export const createClient = (opts?: { apiUrl?: string }) =>
    trpcReact.createClient({
        links: [
            loggerLink({ enabled: () => typeof window !== 'undefined' }),
            httpBatchLink({ url: `${opts?.apiUrl ?? 'http://localhost:4000'}/trpc` }),
        ],
    });


