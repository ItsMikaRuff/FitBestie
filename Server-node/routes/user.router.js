//user.router.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userController = require("../controllers/user.controller");
const bcrypt = require("bcrypt");
const captcha = require("../utils/captcha");
const sendOTPEmail = require("../utils/sendOTPEmail");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");

// const trainerModel = require("../models/trainer.model");
const UserModel = require("../models/user.model");
const RecipeModel = require("../models/recipe.model");
const AddressModel = require("../models/address.model");

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// configure cloud storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "fitbestie_users",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const upload = multer({ storage });

// --------------------- איפוס סיסמה ---------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "יש להזין כתובת מייל" });
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    await sendResetPasswordEmail(user.email, token);
    res.json({ message: "קישור לאיפוס סיסמה נשלח למייל שלך." });
  } catch (err) {
    console.error("שגיאה בשליחת מייל לאיפוס סיסמה:", err);
    res.status(500).json({ message: "שגיאה בשליחת מייל." });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "חסרים פרטים לביצוע איפוס" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "הסיסמה עודכנה בהצלחה" });
  } catch (err) {
    console.error("שגיאה באיפוס סיסמה:", err.message);
    res.status(500).json({ message: "קישור לא חוקי או שפג תוקפו" });
  }
});

// --------------------- הרשמה ---------------------
router.post("/", async (req, res) => {
  console.log("📝 received data:", req.body);
  try {
    const user = await userController.createUser(req.body);
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("❌ create error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// --------------------- התחברות ---------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;
    const isHuman = await captcha(captchaToken);
    if (!isHuman) {
      return res.status(403).json({ message: "אימות CAPTCHA נכשל. אנא אשר שאתה לא רובוט." });
    }
    const user = await userController.readOne({ email });
    if (!user) {
      return res.status(401).json({ message: "אימייל או סיסמה שגויים" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "אימייל או סיסמה שגויים" });
    }
    if (user.twoFactorEnabled && user.role === "admin") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 5 * 60 * 1000);
      user.otpCode = otp;
      user.otpExpiresAt = expires;
      await user.save();
      await sendOTPEmail(user.email, otp);
      return res.status(206).json({
        message: "OTP נשלח למייל",
        requireOTP: true,
        userId: user._id,
      });
    }
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "שגיאה בשרת בעת התחברות" });
  }
});

router.post("/login/verify-otp", async (req, res) => {
  const { userId, otp } = req.body;
  const user = await UserModel.findById(userId);
  if (!user || !user.otpCode || new Date() > user.otpExpiresAt) {
    return res.status(400).json({ message: "OTP לא תקף או פג תוקף" });
  }
  if (otp !== user.otpCode) {
    return res.status(401).json({ message: "OTP שגוי" });
  }
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  const payload = { id: user._id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ user, token });
});

// --------------------- הפעלת 2FA ---------------------
router.put("/:id/2fa", async (req, res) => {
  try {
    const updatedUser = await userController.update(
      { _id: req.params.id },
      { twoFactorEnabled: req.body.enabled }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון אימות דו־שלבי", error: err.message });
  }
});

// --------------------- מאמנות בהמתנה ---------------------
router.get("/pending-trainers", async (req, res) => {
  try {
    const pendingTrainers = await userController.read({
      role: "trainer",
      trainerStatus: "pending",
    });
    res.send(pendingTrainers);
  } catch (error) {
    res.status(500).send("Error fetching pending trainers");
  }
});

// --------------------- חיפוש מאמנות לפי סוג ---------------------
router.get("/search", async (req, res) => {
  try {
    const { type } = req.query;
    const query = {
      role: type || "trainer",
      trainerStatus: "approved",
    };
    const results = await userController.searchByTypeAndLocation(query);
    console.log("Search results:", results);
    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching for trainers" });
  }
});

// דירוג מאמנת
router.put('/:id/rate', requireAuth, async (req, res) => {
  const { rating } = req.body;
  const userId = req.user.id; // מהטוקן, המשתמש המדורג

  if (typeof rating !== 'number' || rating < 0 || rating > 5) {
    return res.status(400).json({ message: "דירוג לא חוקי" });
  }
  try {
    const trainer = await UserModel.findById(req.params.id);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: "מאמנת לא נמצאה" });
    }

    // עדכני/הוסיפי דירוג של המשתמש
    let found = false;
    if (!trainer.ratings) trainer.ratings = [];
    trainer.ratings = trainer.ratings.map(r => {
      if (r.user.toString() === userId) {
        found = true;
        return { user: r.user, value: rating }; // עדכון ערך קיים
      }
      return r;
    });
    if (!found) {
      trainer.ratings.push({ user: userId, value: rating });
    }

    // חישוב ממוצע
    const avg = trainer.ratings.length
      ? (trainer.ratings.reduce((sum, r) => sum + r.value, 0) / trainer.ratings.length)
      : 0;

    trainer.rating = avg;
    await trainer.save();

    res.json({
      message: "הדירוג נשמר!",
      rating: avg,
      ratingsCount: trainer.ratings.length
    });
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת", error: err.message });
  }
});



// --------------------- עדכון משתמש ---------------------
router.post("/update/:id", (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("🧨 Multer error:", err);
      return res.status(500).json({ message: "Multer error", error: err.message });
    }
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) throw new Error("User not found");
      const updates = {};

      // Handle basic user info
      if (req.body.name) updates.name = req.body.name;
      if (req.body.email) updates.email = req.body.email;
      if (req.body.location) updates.location = req.body.location;
      if (req.body.phone) updates.phone = req.body.phone;
      if (req.body.whatsapp) updates.whatsapp = req.body.whatsapp;
      if (req.body.instagram) updates.instagram = req.body.instagram;
      if (req.body.role) updates.role = req.body.role;

      // Handle address (Separate Table)
      let addressId;

      if (req.body.address) {
        try {
          const addressData = typeof req.body.address === 'string'
            ? JSON.parse(req.body.address)
            : req.body.address;
          // עדכני/צרי Address במסד נתונים
          let addressId;
          if (user.address) {
            await AddressModel.findByIdAndUpdate(user.address, addressData);
            addressId = user.address;
          } else {
            const newAddress = await AddressModel.create(addressData);
            addressId = newAddress._id;
          }
          updates.address = addressId;
        } catch (e) {
          console.error("Error parsing address:", e);
        }
      }



      // Handle expertise
      if (req.body.expertise) {
        try {
          // תמיד לנסות לפרסר JSON, ואם נכשל פשוט לשמור כ-string (למקרה שהגיעה רשימה בודדת)
          if (typeof req.body.expertise === 'string' && req.body.expertise.trim().startsWith('[')) {
            updates.expertise = JSON.parse(req.body.expertise);
          } else {
            updates.expertise = Array.isArray(req.body.expertise) ? req.body.expertise : [req.body.expertise];
          }
        } catch (e) {
          updates.expertise = [req.body.expertise];
        }
      }

      // Handle measurements
      if (
        req.body.height ||
        req.body.weight ||
        req.body.bmi ||
        req.body.bmiCategory ||
        req.body.wrist ||
        req.body.ankle ||
        req.body.hip ||
        req.body.waist ||
        req.body.shoulder
      ) {
        const measurements = {};
        if (req.body.height) measurements.height = Number(req.body.height);
        if (req.body.weight) measurements.weight = Number(req.body.weight);
        if (req.body.bmi) measurements.bmi = Number(req.body.bmi);
        if (req.body.bmiCategory) measurements.bmiCategory = req.body.bmiCategory;
        if (req.body.wrist) measurements.wrist = Number(req.body.wrist);
        if (req.body.ankle) measurements.ankle = Number(req.body.ankle);
        if (req.body.hip) measurements.hip = Number(req.body.hip);
        if (req.body.waist) measurements.waist = Number(req.body.waist);
        if (req.body.shoulder) measurements.shoulder = Number(req.body.shoulder);
        measurements.lastUpdated = new Date();
        updates.measurements = measurements;
      }

      // Handle body type
      const allowedBodyTypes = ['אקטומורף', 'מזומורף', 'אנדומורף'];
      let bodyTypeValue = null;
      let bodyTypeDescriptionValue = null;

      if (req.body.bodyType) {
        // אם הגיע אובייקט עם type ו-description
        if (typeof req.body.bodyType === "object") {
          if (typeof req.body.bodyType.type === "string" && allowedBodyTypes.includes(req.body.bodyType.type)) {
            bodyTypeValue = req.body.bodyType.type;
          }
          if (typeof req.body.bodyType.description === "string") {
            bodyTypeDescriptionValue = req.body.bodyType.description;
          }
        }
        // אם הגיע סטרינג בלבד
        else if (typeof req.body.bodyType === "string" && allowedBodyTypes.includes(req.body.bodyType)) {
          bodyTypeValue = req.body.bodyType;
        }
      }

      // תמיכה ב-bodyTypeDescription שמגיע מחוץ לאובייקט (legacy)
      if (typeof req.body.bodyTypeDescription === "string") {
        bodyTypeDescriptionValue = req.body.bodyTypeDescription;
      }

      // רק אם יש לפחות שדה אחד לעדכן
      if (bodyTypeValue !== null || bodyTypeDescriptionValue !== null) {
        updates.bodyType = {
          type: bodyTypeValue,
          description: bodyTypeDescriptionValue,
          lastCalculated: new Date()
        };
      }


      if (req.file && req.file.path) {
        updates.image = req.file.path;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true }
      ).populate("address");

      if (!updatedUser) throw new Error("User not found");

      res.send(updatedUser);
    } catch (error) {
      console.error("🔥 Error updating user:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
});

// --------------------- מתכונים ---------------------
router.post('/:id/favoriteRecipes', requireAuth, async (req, res) => {
  try {
    const { title, ingredients, instructions, tags } = req.body;
    const recipe = new RecipeModel({
      title,
      ingredients,
      instructions,
      tags,
      createdBy: req.params.id
    });
    await recipe.save();
    const user = await UserModel.findById(req.params.id);
    user.favoriteRecipes.push(recipe._id);
    await user.save();
    res.status(201).json({ message: "Recipe saved", recipeId: recipe._id });
  } catch (err) {
    console.error("שגיאה בשמירת מתכון:", err.message);
    res.status(500).json({ message: "Failed to save recipe" });
  }
});

router.get('/:id/favoriteRecipes', requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate('favoriteRecipes');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favoriteRecipes);
  } catch (err) {
    console.error("שגיאה בשליפת מועדפים:", err.message);
    res.status(500).json({ message: "שגיאה בטעינת מועדפים" });
  }
});

router.delete('/:id/favoriteRecipes/:recipeId', requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.favoriteRecipes = user.favoriteRecipes.filter(recipeId => recipeId.toString() !== req.params.recipeId);
    await user.save();
    res.json({ message: "Recipe removed from favorites" });
  } catch (err) {
    console.error("שגיאה בהסרת מתכון מהמועדפים:", err.message);
    res.status(500).json({ message: "Failed to remove recipe from favorites" });
  }
});

// --------------------- Favorite Trainer, update & get ---------------------
router.put("/favorites", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    const { trainerId } = req.body;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!trainerId) {
      return res.status(400).json({ message: "Trainer ID required" });
    }
    const exists = user.favoriteTrainers.includes(trainerId);
    if (exists) {
      user.favoriteTrainers = user.favoriteTrainers.filter(id => id.toString() !== trainerId);
    } else {
      user.favoriteTrainers.push(trainerId);
    }
    await user.save();
    res.json({ favorites: user.favoriteTrainers });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון מועדפים", error: err.message });
  }
});

router.get("/favorites", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate({
      path: "favoriteTrainers",
      model: "User",
      select: "name image role address expertise rating",
      options: { strictPopulate: false },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const favorites = Array.isArray(user.favoriteTrainers)
      ? user.favoriteTrainers.filter(trainer => trainer && trainer.name)
      : [];
    res.json({ favorites });
  } catch (err) {
    console.error("🔥 Error in GET /favorites:", err);
    res.status(500).json({
      message: "שגיאה בשליפת מועדפים",
      error: err?.message || "Unknown error",
      stack: err?.stack || null
    });
  }
});



// --------------------- חיפוש לפי עיר ---------------------
router.get('/searchByCity', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ message: 'יש להזין עיר' });
  try {
    const addresses = await AddressModel.find({ city: { $regex: city, $options: 'i' } });
    const addressIds = addresses.map(a => a._id);
    const users = await UserModel.find({
      address: { $in: addressIds },
      role: 'trainer',
      trainerStatus: 'approved'
    }).populate('address');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בחיפוש לפי עיר' });
  }
});

// --------------------- קבלת כל המשתמשים ---------------------
router.get("/", async (req, res) => {
  try {
    const users = await userController.read({ ...req.query });
    res.send(users);
  } catch (error) {
    res.status(500).send("Error getting users");
  }
});

// --------------------- מחיקת משתמש ---------------------
router.delete("/:id", async (req, res) => {
  try {
    const user = await userController.readOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const deletedUser = await userController.deleteOne({ _id: req.params.id });
    if (!deletedUser) {
      return res.status(500).json({ message: "Failed to delete user" });
    }
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// --------------------- שליפת משתמש לפי ID ---------------------
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate("address");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user by ID:", err.message);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});



// --------------------- איפוס סיסמה ע"י אדמין ---------------------
router.post("/admin-reset-password", requireAuth, requireRole(["admin", "superAdmin"]), async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) {
    return res.status(400).json({ message: "חסרים פרטים" });
  }
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });
    res.json({ message: "הסיסמה אופסה בהצלחה" });
  } catch (err) {
    console.error("שגיאה באיפוס סיסמה ע״י אדמין:", err.message);
    res.status(500).json({ message: "שגיאה באיפוס סיסמה" });
  }
});


// --------------------- שליחת קישור איפוס סיסמה למייל ע"י אדמין ---------------------
router.post("/admin-send-reset-link", requireAuth, requireRole(["admin", "superAdmin"]), async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "יש להזין כתובת מייל" });
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    await sendResetPasswordEmail(user.email, token);
    res.json({ message: "קישור איפוס נשלח בהצלחה" });
  } catch (err) {
    console.error("שגיאה בשליחת קישור ע״י אדמין:", err.message);
    res.status(500).json({ message: "שגיאה בשליחת קישור" });
  }
});

module.exports = router;
