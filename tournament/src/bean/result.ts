class Result<T> {
    public statusCode: number;
    public data?: T;
    public message?: string;

    constructor(statusCode: number, data?: T, message?: string) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export default Result;