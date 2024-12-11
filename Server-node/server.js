//express
const express = require("express")
const cors = require("cors")
const app = express()
const port =  5000

//db connection
require('./db').connect()

//routers
const userRouter = require('./routes/user.router')


//middleware
app.use(express.json())
app.use(cors())

//routes
app.use('/user',userRouter)

const userController = require('./controllers/user.controller')

app.listen(port,()=>{
    console.log('listening on port 5000');
    
})