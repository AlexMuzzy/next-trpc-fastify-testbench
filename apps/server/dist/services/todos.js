const todos = [
    { id: '1', title: 'Set up monorepo', completed: true },
    { id: '2', title: 'Wire Fastify + tRPC', completed: true },
    { id: '3', title: 'Add Clerk + PostHog', completed: false },
    { id: '4', title: 'Deploy to production', completed: false },
];
export async function listTodos() {
    // Simulate async fetch by returning a resolved promise
    return todos;
}
