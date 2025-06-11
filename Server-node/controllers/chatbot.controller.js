// server/controllers/chatbot.controller.js
const axios = require('axios');

exports.askAI = async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided' });

    try {
        const openaiRes = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o', // או gpt-3.5-turbo, תלוי ב-API שלך
                messages: [
                    { role: 'system', content: 'אתה מאמן כושר ותזונאי אישי לנשים ונערות. תן תשובות מקצועיות ומעצימות בלבד.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 200,
                temperature: 0.7
            },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
        );
        const answer = openaiRes.data.choices[0].message.content;
        res.json({ answer });
    } catch (err) {
        res.status(500).json({ error: 'בעיה עם ה-AI' });
    }
};
