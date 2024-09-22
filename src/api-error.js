class ApiError extends Error {
    constructor(statusCode, message, headers = {}) {
        super(message);
        this.statusCode = statusCode;
        this.headers = headers;
    }
}
module.exports = ApiError;