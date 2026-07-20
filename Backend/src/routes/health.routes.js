const express = require('express')
const HealthController = require('../controllers/health.controller')
const asyncHandler = require('../middlewares/asyncHandler.middleware')

const router = express.Router()

/**
 * @route GET /health
 * @description Checks the health status of the application and its dependencies.
 * @access Public
 */
router.get('/', asyncHandler(HealthController.healthCheck))



module.exports = router