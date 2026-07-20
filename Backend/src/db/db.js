const mongoose = require('mongoose')
const logger = require('../utils/logger')

async function connectDB(){

    try{
        await mongoose.connect(process.env.MONGO_URI)
        logger.info('MongoDB connected successfully')
    }catch(error){
        logger.error({ err: error }, 'MongoDB connection failed')
    }

}
module.exports = connectDB