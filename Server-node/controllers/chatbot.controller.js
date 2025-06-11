// server/controllers/chatbot.controller.js
const axios = require('axios');
const MeasurementModel = require("../models/measurement.model"); // התאימי שם לפי מה שיש אצלך
const UserModel = require("../models/user.model");

exports.askAIWithMetrics = async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided' });

    try {
        const userId = req.user.id;
        // שליפת המשתמש כולל מדדים + bodyType
        const user = await UserModel.findById(userId);
        const m = user.measurements || {};
        const bodyType = user.bodyType && user.bodyType.type ? user.bodyType.type : null;
        const bodyTypeDesc = user.bodyType && user.bodyType.description ? user.bodyType.description : '';

        let prompt = '';
        if (m && m.bmi && m.height && m.weight) {
            prompt = `
המשתמשת שואלת: "${message}"
נתוני המשתמשת: 
• גיל: ${user.age || 'לא ידוע'}
• משקל: ${m.weight || '-'} ק"ג
• גובה: ${m.height || '-'} ס"מ
• BMI: ${m.bmi || '-'}
${bodyType ? `• סוג גוף: ${bodyType}${bodyTypeDesc ? ` (${bodyTypeDesc})` : ''}` : ''}
ענה תשובה אישית על סמך כל הנתונים.
`;
        } else {
            prompt = `
המשתמשת שואלת: "${message}"
אין נתוני מדדים זמינים (BMI/גובה/משקל${bodyType ? ', אבל יש סוג גוף' : ''}).
${bodyType ? `סוג גוף: ${bodyType}${bodyTypeDesc ? ` (${bodyTypeDesc})` : ''}` : ''}
ענה תשובה כללית, והמלץ למלא מדדים בעמוד "מדדים" באתר לקבלת המלצות מותאמות אישית.
`;
        }

        // קריאה ל־OpenAI
        const openaiRes = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'אתה מאמן כושר ותזונה אישי לנשים ונערות. תן תשובות מקצועיות ומעצימות בלבד.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 250,
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
