const express = require('express')
const UrlController = require('../controllers/url.controller')


const router = express.Router()

/**
 * @route POST /api/url/shorten
 * @description Creates a shortened URL from the provided original URL
 * @access Public
 */
router.post('/shorten', UrlController.shortenURL)

/**
 * @route GET /api/url/:shortCode
 *@description Redirects the user to the original URL associated with the short code.
 * @access Public
 */
router.get('/:shortCode', UrlController.redirectToOriginalURL)


module.exports = router