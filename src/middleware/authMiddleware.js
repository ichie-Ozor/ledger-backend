const errorHandler = (error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message || "Internal server error" })
}

const notFound = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`)
    error.status = 404
    next(error)
}

module.exports = {
    errorHandler,
    notFound
}