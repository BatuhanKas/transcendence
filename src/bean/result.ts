class Result<T> {
    statusCode: number;
    data?: T;
    message?: string;

    constructor(statusCode: number, data?: T, message?: string) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export default Result;