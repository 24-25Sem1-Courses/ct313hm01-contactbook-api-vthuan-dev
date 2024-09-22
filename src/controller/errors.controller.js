const ApiError = require('../api-error');
const Jsend = require('../jsend');
function methodNotAllowed(req, res, next) {
    if (req.route) {
        const httpMethod = Object.keys(req.route.methods).
        filter((method) => method !== 'all')
        .map((method) => method.toUpperCase());
        return next(
            new ApiError(405, `${httpMethod} method not allowed for ${req.path}`, {
                Allow: httpMethod
            })
        );
    }
    return next();
    }

    function resourceNotFound(req, res, next) {
     
        return next(new ApiError(404, 'Resource not found'));
    }
    
    function handleError(error, req, res, next) {
     
    
        if (res.headersSent) {
            return next(error);
        }
    
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
    
        return res
            .status(statusCode)
            .set(error.headers || {})
            .json(
                statusCode >= 500 ? Jsend.error(message) : Jsend.fail(message)
            );
    }
    

    
    module.exports = {
        methodNotAllowed,
        resourceNotFound,
        handleError,
    };