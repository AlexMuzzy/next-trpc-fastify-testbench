export type Todo = {
    id: string;
    title: string;
    completed: boolean;
};

const todos: Todo[] = [
    { id: '1', title: 'Set up monorepo', completed: true },
    { id: '2', title: 'Wire Fastify + tRPC', completed: true },
    { id: '3', title: 'Add Clerk + PostHog', completed: false },
    { id: '4', title: 'Deploy to production', completed: false },
]

export const listTodos = async () => {
    return todos;
}