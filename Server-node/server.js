//express
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

const multer = require("multer");
const upload = multer({ dest: "uploads/" });


//db connection
require('./db').connect()



//routers
const userRouter = require('./routes/user.router')
const quizRouter = require('./routes/quiz.router')


//middleware

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://fitbestie.vercel.app",
        "https://www.fitbestie.com" 
    ],
    credentials: true,
}));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


//routes
app.use('/user', userRouter);
app.use('/quiz', quizRouter);

app.get('/ping', (req, res) => {
    res.send('pong!');
});

// כדי להגיש את הקבצים
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {

    console.log('listening on port 5000');

})