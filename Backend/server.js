const app = require('./src/app')
const connectDB = require('./src/db/db')
const redisClient = require('./src/db/redis')
const logger  = require('./src/utils/logger')


async function startServer(){
    try{

        //connect mongo db
        await connectDB()
        
        //connect redis
        await redisClient.connect()
        logger.info('Redis connected successfully')

        app.listen(process.env.PORT, ()=>{
            logger.info(`server is running on port ${process.env.PORT}`)
        })

    }catch(error){
        console.error("Failed to start server:", error);
    }
}

startServer()

