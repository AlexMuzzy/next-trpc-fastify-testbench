import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import { listTodos, createTodo, updateTodo } from './services/todos.js';

export type RequestContext = {
    userId: string | null;
};

const t = initTRPC.context<RequestContext>().create({
    transformer: superjson,
});
export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
    healthz: publicProcedure.query(() => 'ok'),
    echo: publicProcedure.input(z.object({ message: z.string() })).mutation(({ input }) => ({ message: input.message })),
    todos: router({
        list: publicProcedure.query(async () => listTodos()),
        create: publicProcedure
            .input(z.object({ title: z.string().min(1).max(200) }))
            .mutation(async ({ input }) => createTodo(input.title)),
        update: publicProcedure
            .input(z.object({ id: z.string(), title: z.string().min(1).max(200), completed: z.boolean() }))
            .mutation(async ({ input }) => updateTodo(input.id, input.title, input.completed)),
    }),
});

export type AppRouter = typeof appRouter;


