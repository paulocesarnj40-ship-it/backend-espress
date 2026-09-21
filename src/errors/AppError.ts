export class AppError{
    public readonly message: string;
    public readonly statusCode: number;
    public readonly details?:unknown;

    constructor(message: string, statusCode = 400, details?: unknown){
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
    }
}
