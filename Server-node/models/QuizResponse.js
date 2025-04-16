// models/QuizResponse.js
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    answers: {
        goal: String,
        activity: String,
        bodyType: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("QuizResponse", quizSchema);
