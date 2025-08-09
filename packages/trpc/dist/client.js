import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
export const trpcReact = createTRPCReact({});
export const createClient = (opts) => trpcReact.createClient({
    links: [
        loggerLink({
            enabled: (op) => (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') ||
                (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchLink({ url: `${opts?.apiUrl ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/trpc` }),
    ],
});
