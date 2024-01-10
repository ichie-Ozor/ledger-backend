class APIError extends Error {
    constructor(status, message) {
        super(message)
        this.message = message
        this.status = status
    }

    static badRequest(msg){
        const message = msg || "Invalid request!"
        return new APIError(400, message)
    }
    static unAuthorized(msg){
        const message = msg || "access denied!"
        return new APIError(401, message)
    }
    static unAuthenticated(msg){
        const message = msg || "You need to login first!"
        return new APIError(403, message)
    }
    static notFound(msg){
        const message = msg || "Resource not found!"
        return new APIError(400, message)
    }
    static customError(msg){
        const message = msg || "Internal server error!"
        return new APIError(500, message)
    }
}

export default APIError