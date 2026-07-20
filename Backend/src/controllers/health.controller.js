const mongoose = require('mongoose')
const redisClient = require('../db/redis')

async function healthCheck(req, res) {

    // Check MongoDB connection
    const mongoStatus =
        mongoose.connection.readyState === 1
            ? 'connected'
            : 'disconnected';

    // Check Redis connection
    const redisStatus =
        redisClient.isReady
            ? 'connected'
            : 'disconnected';

    // Check if all dependencies are healthy
    const isHealthy =
        mongoStatus === 'connected' &&
        redisStatus === 'connected';

    return res.status(isHealthy ? 200 : 503).json({
        success: isHealthy,
        status: isHealthy ? 'healthy' : 'unhealthy',
        services: {
            mongodb: mongoStatus,
            redis: redisStatus
        }
    });
}

module.exports = {healthCheck}