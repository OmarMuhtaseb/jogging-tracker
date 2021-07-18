export enum Role {
    user = 'user',
    manager = 'manager',
    admin = 'admin',
}

export type AuthUser = {
    id: string;
    email: string;
    roles: Role[];
}
