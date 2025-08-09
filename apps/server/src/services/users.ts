
type User = {
    id: string;
    name: string;
    email: string;
}

const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' },
]

export const getUsers = async (): Promise<User[]> => {
    return users;
}

export const getUser = async (id: string): Promise<User | undefined> => {
    return users.find((user) => user.id === id);
}

export const createUser = async (name: string, email: string): Promise<User> => {
    const user: User = { id: String(Date.now()), name, email };
    users.push(user);
    return user;
}