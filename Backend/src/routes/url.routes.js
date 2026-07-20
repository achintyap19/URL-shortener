const express = require('express')
const UrlController = require('../controllers/url.controller')
const urlValidator = require('../middlewares/url.middleware')
const asyncHandler = require('../middlewares/asyncHandler.middleware')
const {urlShortenerLimiter} = require('../middlewares/rateLimiter.middleware')


const router = express.Router()

/**
 * @route POST /api/url/shorten
 * @description Creates a shortened URL from the provided original URL
 * @access Public
 */
router.post('/shorten',urlShortenerLimiter, urlValidator.validateOriginalURL, asyncHandler(UrlController.shortenURL))

/**
 * @route GET /api/url/analytics/:shortCode
 * @description Retrieves analytics for the specified short URL.
 * @access Public
 */
router.get('/analytics/:shortCode', asyncHandler(UrlController.getAnalytics))

/**
 * @route GET /api/url/:shortCode
 *@description Redirects the user to the original URL associated with the short code.
 * @access Public
 */
router.get('/:shortCode', asyncHandler(UrlController.redirectToOriginalURL))

/**
 * @route PATCH /api/url/:shortCode
 * @description Updates the original URL associated with a short code and invalidates the cached URL.
 * @access Public
 */
router.patch('/:shortCode',urlValidator.validateOriginalURL, asyncHandler(UrlController.updateURL))

/**
 * @route DELETE /api/url/:shortCode
 * @description Deletes the short URL from the database and removes it from the Redis cache.
 * @access Public
 */
router.delete('/:shortCode',
    asyncHandler(UrlController.deleteURL)
);




module.exports = router