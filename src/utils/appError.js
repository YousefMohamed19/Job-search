// create class of app error

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode=statusCode
    }
}