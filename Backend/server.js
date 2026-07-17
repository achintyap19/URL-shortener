const app = require('./src/app')
const connectDB = require('./src/db/db')
const redisClient = require('./src/db/redis')


async function startServer(){
    try{

        //connect mongo db
        await connectDB()
        
        //connect redis
        await redisClient.connect()
        console.log('Redis connected successfully')

        app.listen(process.env.PORT, ()=>{
            console.log('server is running on port 3000')
        })

    }catch(error){
        console.error("Failed to start server:", error);
    }
}

startServer()

