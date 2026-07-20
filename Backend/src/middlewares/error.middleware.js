const logger = require('../utils/logger')

function errorHandler(err, req, res, next) {

    logger.error({ err }, 'Unhandled application error');

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

}

module.exports = errorHandler;