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

export const createTodo = async (title: string): Promise<Todo> => {
    const todo: Todo = {
        id: String(Date.now()),
        title,
        completed: false,
    };
    todos.push(todo);
    return todo;
}

export const updateTodo = async (id: string, title: string, completed: boolean) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) throw new Error('Todo not found');
    todo.title = title;
    todo.completed = completed;
    return todo;
}