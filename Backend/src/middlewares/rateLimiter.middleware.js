const {rateLimit} = require('express-rate-limit')

const urlShortenerLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 10,           // Maximum 10 requests per minute

    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    }
})

module.exports = {urlShortenerLimiter}