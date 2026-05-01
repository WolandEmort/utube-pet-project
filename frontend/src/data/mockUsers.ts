export type Role = 'user' | 'admin';

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: Role;
}

export const MOCK_USERS: User[] = [
    {
        id: "1",
        email: "1@test.com",
        password: "admin",
        name: "Адмін",
        role: "admin"
    },
    {
        id: "2",
        email: "2@test.com",
        password: "user",
        name: "Просто юзер",
        role: "user"
    }
];