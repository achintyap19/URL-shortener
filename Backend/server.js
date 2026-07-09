const app = require('./src/app')
const connectDB = require('./src/db/db')


connectDB()

app.listen(process.env.PORT, ()=>{
    console.log('server is running on port 3000')
})