// routes/quiz.js

const express = require("express");
const router = express.Router();
const QuizResponse = require("../models/QuizResponse");

// POST /api/quiz
router.post("/", async (req, res) => {
    try {
        const { userId, answers } = req.body;

        const quiz = new QuizResponse({
            userId,
            answers,
            createdAt: new Date(),
        });

        await quiz.save();
        res.status(201).json({ message: "Quiz saved successfully" });
    } catch (error) {
        console.error("Failed to save quiz:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
