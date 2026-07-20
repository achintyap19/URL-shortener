const {createClient} = require('redis')
const logger = require('../utils/logger')

const redisClient = createClient({
    url: 'redis://localhost:6379'
})

redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error);
})

module.exports = redisClient