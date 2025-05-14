require('dotenv').config();

//express
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// CORS options
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://fitbestie.vercel.app",
        "https://www.fitbestie.com"
    ],
    credentials: true,
};

//db connection
require('./db').connect()

//routers
const userRouter = require('./routes/user.router')
const quizRouter = require('./routes/quiz.router')
const bodyTypeRouter = require("./routes/bodyType.router");
const measurementRouter = require("./routes/measurement.router");


//middleware
app.use(cors(corsOptions));              // קריאות רגילות
app.options('*', cors(corsOptions));    // קריאות Preflight (OPTIONS)

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//routes
app.use('/user', userRouter);
app.use('/search', userRouter);
app.use('/quiz', quizRouter);
app.use('/bodyType', bodyTypeRouter);
app.use('/measurement', measurementRouter);

app.get('/ping', (req, res) => {
    res.send('pong!');
});

// כדי להגיש את הקבצים
app.use("/uploads", express.static("uploads"));

// טיפול בשגיאות 404
app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found - This route doesn't exist." });
});

app.listen(port, () => {
    console.log('listening on port 5000');
});