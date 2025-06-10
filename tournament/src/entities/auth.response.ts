export interface AuthResponse {
    status: string;
    message: string;
    data: {
        uuid: string;
        username: string;
    };
}
