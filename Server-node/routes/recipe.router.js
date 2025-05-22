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
יש לי את המרכיבים הבאים: ${ingredients.join(", ")}.
תציע לי 2–3 מתכונים בריאים וקלים להכנה בפורמט הבא:

---
### שם המתכון: חביתה ירוקה

מרכיבים:
- 2 ביצים
- חופן תרד
- מלח

הוראות הכנה:
1. טורפים את הביצים בקערה.
2. מוסיפים תרד ומלח.
3. מטגנים במחבת.

תגיות (אם רלוונטי): טבעוני, כשר, ללא גלוטן

---

הפרד בין מתכונים עם --- וכתוב כל מתכון במבנה הזה. 
השתמש בעברית פשוטה וברורה.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
