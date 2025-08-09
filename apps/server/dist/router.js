import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { listTodos } from './services/todos';
const t = initTRPC.context().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const appRouter = router({
    healthz: publicProcedure.query(() => 'ok'),
    echo: publicProcedure.input(z.object({ message: z.string() })).mutation(({ input }) => ({ message: input.message })),
    todos: router({
        list: publicProcedure.query(async () => listTodos()),
    }),
});
