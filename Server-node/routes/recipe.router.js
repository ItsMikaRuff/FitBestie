// recipe.router.js – גרסה תואמת לגרסת OpenAI v4 ומעלה
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// את זה חובה אם את משתמשת ב־.env
require("dotenv").config();

// מייצרים מופע של OpenAI עם המפתח
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate", async (req, res) => {
  const { ingredients } = req.body;

  const prompt = `
אתה עוזר מתכונים בעברית באתר FitBestie.
המטרה שלך היא להציע אך ורק מתכונים אמיתיים ובריאים לפי רשימת המצרכים שהמשתמש שולח.
אם אין ברשימת המצרכים מספיק פרטים, בקש מהמשתמש לכתוב רשימת מרכיבים ברורה.
לעולם אל תמציא מילים, שמות של מרכיבים או הוראות לא קיימות.
אם אינך בטוח בשם של רכיב – כתוב רק מה שבטוח, אל תמציא.
אם המשתמש לא מבקש מתכון או לא רושם מצרכים, תענה: "אני כאן כדי לעזור למצוא מתכונים. כתוב לי מה יש לך בבית ואציע לך רעיונות!"
החזר 2-3 מתכונים בלבד, וכל מתכון בפורמט הבא, בין מתכון למתכון יש ---
---

### שם המתכון: [שם]
מרכיבים:
- [רכיב 1]
- [רכיב 2]
הוראות הכנה:
1. [שלב 1]
2. [שלב 2]
תגיות (אם רלוונטי): [תגית 1, תגית 2]
---
כל מרכיב, הוראה ותגית – אמיתיים בלבד, לא להמציא ולא להוסיף מילים לא קיימות.
המצרכים שניתנו: ${ingredients.join(", ")}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ recipes: completion.choices[0].message.content });
  } catch (err) {
    console.error("שגיאה בצ'אט:", err.message);
    res.status(500).json({ error: "נכשל ביצירת מתכונים" });
  }
});


router.get("/", async (req, res) => {
  const recipes = await RecipeModel.find().sort({ createdAt: -1 });
  res.json(recipes);
});

router.get("/:id", async (req, res) => {
  const recipe = await RecipeModel.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  res.json(recipe);
});

router.get("/tag/:tag", async (req, res) => {
  const recipes = await RecipeModel.find({ tags: req.params.tag });
  res.json(recipes);
});

router.post("/", async (req, res) => {
  const { title, ingredients, instructions, tags } = req.body;
  const recipe = new RecipeModel({ title, ingredients, instructions, tags });
  await recipe.save();
  res.status(201).json(recipe);
});

module.exports = router;
