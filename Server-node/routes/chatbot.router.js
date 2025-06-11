const express = require('express');
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const { askAIWithMetrics } = require('../controllers/chatbot.controller');

// תמיד עם requireAuth (שיהיה לך את req.user.id)
router.post('/', requireAuth, askAIWithMetrics);

module.exports = router;
