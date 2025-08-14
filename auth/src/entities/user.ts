export type User = {
    uuid: string;
    username: string;
    password: string;
    new_password?: string;
    email: string;
    verified?: boolean;
};