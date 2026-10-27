export interface User {
    id: number;
    username: string;
    fullName: string;
    role: 'ADMIN' | 'STAFF';
    createdAt?: string;
}

export type CreateUserDto = Omit<User, 'id' | 'createdAt'>;