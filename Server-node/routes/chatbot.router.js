const express = require('express');
const { askAI } = require('../controllers/chatbot.controller');
const router = express.Router();

router.post('/', askAI);

module.exports = router;
