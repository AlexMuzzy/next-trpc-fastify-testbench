export type Todo = {
    id: string;
    title: string;
    completed: boolean;
};
export declare function listTodos(): Promise<Todo[]>;
