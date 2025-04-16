//express
const express = require("express");
const cors = require("cors");
const app = express();
const port =  5000;

//db connection
require('./db').connect()

//routers
const userRouter = require('./routes/user.router')
const quizRouter = require('./routes/quiz.router')


//middleware
app.use(cors());
app.use(express.json());


//routes
app.use('/user',userRouter);
app.use('/quiz',quizRouter);


app.listen(port,()=>{
    
    console.log('listening on port 5000');
    
})