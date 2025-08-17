// user.router.js

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

const UserModel = require("../models/user.model");
const RecipeModel = require("../models/recipe.model");
const AddressModel = require("../models/address.model");

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// ---------- Cloudinary upload ----------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fitbestie_users",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const upload = multer({ storage });

// ---------- Tokens ----------
function generateTokens(user) {
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

// קונפיגורציה מרוכזת לעוגיית רענון (DEV/PROD)
function cookieOpts() {
  const isProd = process.env.NODE_ENV === "production";
  return isProd
    ? { httpOnly: true, secure: true, sameSite: "None", maxAge: 7 * 24 * 60 * 60 * 1000 }
    : { httpOnly: true, secure: false, sameSite: "Lax",  maxAge: 7 * 24 * 60 * 60 * 1000 };
}

/* ======================= RESET PASSWORD ======================= */

// (גרסה אחת בלבד – מחקתי כפילות)
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: "חסרים פרטים לביצוע איפוס" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("refreshToken", refreshToken, cookieOpts());
    res.json({ user, token: accessToken, message: "הסיסמה עודכנה בהצלחה" });
  } catch (err) {
    console.error("שגיאה באיפוס סיסמה:", err.message);
    res.status(500).json({ message: "קישור לא חוקי או שפג תוקפו" });
  }
});

/* ======================= FORGOT PASSWORD ======================= */

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

/* ======================= REGISTER ======================= */

router.post("/", async (req, res) => {
  console.log("📝 received data:", req.body);
  try {
    const user = await userController.createUser(req.body);
    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("refreshToken", refreshToken, cookieOpts());
    res.status(201).json({ user, token: accessToken });
  } catch (err) {
    console.error("❌ create error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* ======================= LOGIN ======================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "חסר אימייל או סיסמה" });
    }
    if (!captchaToken) {
      return res.status(400).json({ message: "חסר captchaToken" });
    }

    // אימות CAPTCHA (מוגן משגיאה פנימית)
    let isHuman = false;
    try {
      isHuman = await captcha(captchaToken);
    } catch (e) {
      console.error("captcha() error:", e?.message || e);
      return res.status(502).json({ message: "שגיאה באימות CAPTCHA" });
    }
    if (!isHuman) {
      return res.status(403).json({ message: "אימות CAPTCHA נכשל. אנא אשר שאתה לא רובוט." });
    }

    // שימי לב: readOne כנראה מחזיר אובייקט רגיל (לא Document)
    const user = await userController.readOne({ email }, true);
    if (!user) return res.status(401).json({ message: "אימייל או סיסמה שגויים" });
    if (!user.password) {
      return res.status(400).json({ message: "לא קיימת סיסמה למשתמש זה. אנא אפס/י סיסמה או הירשם/י מחדש." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "אימייל או סיסמה שגויים" });

    // 2FA לאדמין – עדכון ישיר במסד (לא user.save())
    if (user.twoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 5 * 60 * 1000);
      await UserModel.updateOne({ _id: user._id }, { $set: { otpCode: otp, otpExpiresAt: expires } });
      await sendOTPEmail(user.email, otp);
      return res.status(206).json({ message: "OTP נשלח למייל", requireOTP: true, userId: user._id });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("refreshToken", refreshToken, cookieOpts());

    // העלאת מונה התחברויות + חותמת זמן — בלי user.save()
    await UserModel.updateOne(
      { _id: user._id },
      { $inc: { loginCount: 1 }, $set: { lastLoginAt: new Date() } }
    );

    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.otpCode;
    delete safeUser.otpExpiresAt;

    return res.json({ user: safeUser, token: accessToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "שגיאה בשרת בעת התחברות" });
  }
});

router.post("/login/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await UserModel.findById(userId);
    if (!user || !user.otpCode || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP לא תקף או פג תוקף" });
    }
    if (otp !== user.otpCode) {
      return res.status(401).json({ message: "OTP שגוי" });
    }

    // אפס את ה-OTP בעדכון ישיר
    await UserModel.updateOne(
      { _id: user._id },
      { $unset: { otpCode: "", otpExpiresAt: "" } }
    );

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("refreshToken", refreshToken, cookieOpts());
    res.json({ user, token: accessToken });
  } catch (err) {
    console.error("verify-otp error:", err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

// --------------------- הפעלת/כיבוי 2FA ---------------------
router.put("/:id/2fa", async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    // ודאי שהערך בוליאני
    const twoFactorEnabled = !!enabled;

    const doc = await UserModel.findByIdAndUpdate(
      id,
      { twoFactorEnabled },
      { new: true, runValidators: true, select: "twoFactorEnabled" }
    );

    if (!doc) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ twoFactorEnabled: doc.twoFactorEnabled });
  } catch (err) {
    console.error("2FA toggle error:", err);
    return res.status(500).json({ message: "שגיאה בעדכון 2FA" });
  }
});


/* ======================= PENDING TRAINERS ======================= */
router.get(
  "/pending-trainers",
  requireAuth,
  requireRole(["worker", "superAdmin", "manager"]),
  async (req, res) => {
    try {
      const trainers = await UserModel.find(
        { role: "trainer", trainerStatus: "pending" },
        "name email role phone phoneNumber contact address paymentDetails"
      ).lean();

      const sanitized = trainers.map((u) => {
        const phone =
          u.phone ||
          u.phoneNumber ||
          (u.contact && (u.contact.phone || u.contact.phoneNumber)) ||
          (u.address && (u.address.phone || u.address.phoneNumber)) ||
          "";

        let last4 = null;
        if (u.paymentDetails?.cardNumber) {
          const digits = String(u.paymentDetails.cardNumber).replace(/\D/g, "");
          if (digits.length >= 4) last4 = digits.slice(-4);
        }
        if (!last4 && u.paymentDetails?.last4) {
          const digits = String(u.paymentDetails.last4).replace(/\D/g, "");
          if (digits.length === 4) last4 = digits;
        }
        if (!last4 && u.paymentDetails?.cardNumber && /\*{4}\s?(\d{4})$/.test(u.paymentDetails.cardNumber)) {
          last4 = u.paymentDetails.cardNumber.match(/(\d{4})$/)?.[1] || null;
        }

        return { _id: u._id, name: u.name || "", email: u.email || "", phone, last4 };
      });

      res.json(sanitized);
    } catch (error) {
      console.error("Error fetching pending trainers:", error);
      res.status(500).send("Error fetching pending trainers");
    }
  }
);

/* ======================= APPROVE / REJECT TRAINER ======================= */
router.post("/approve-trainer/:id", requireAuth, requireRole(["worker", "superAdmin"]), async (req, res) => {
  try {
    const trainer = await UserModel.findById(req.params.id);
    if (!trainer || trainer.role !== "trainer") {
      return res.status(404).json({ message: "מאמנת לא נמצאה" });
    }
    trainer.trainerStatus = "approved";
    await trainer.save();
    res.json({ message: "המאמנת אושרה", trainerId: trainer._id });
  } catch (err) {
    console.error("❌ Error approving trainer:", err.message);
    res.status(500).json({ message: "שגיאת שרת באישור מאמנת" });
  }
});

router.post("/reject-trainer/:id", requireAuth, requireRole(["worker", "superAdmin"]), async (req, res) => {
  try {
    const trainer = await UserModel.findById(req.params.id);
    if (!trainer || trainer.role !== "trainer") {
      return res.status(404).json({ message: "מאמנת לא נמצאה" });
    }
    trainer.trainerStatus = "rejected";
    await trainer.save();
    res.json({ message: "הבקשה נדחתה", trainerId: trainer._id });
  } catch (err) {
    console.error("❌ Error rejecting trainer:", err.message);
    res.status(500).json({ message: "שגיאת שרת בדחיית מאמנת" });
  }
});

/* ======================= SEARCH TRAINERS ======================= */
router.get("/search", async (req, res) => {
  try {
    const { type } = req.query;
    const query = { role: type || "trainer", trainerStatus: "approved" };
    const results = await userController.searchByTypeAndLocation(query);
    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching for trainers" });
  }
});

/* ======================= RATE TRAINER ======================= */
router.put("/:id/rate", requireAuth, async (req, res) => {
  const { rating } = req.body;
  const userId = req.user.id;
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return res.status(400).json({ message: "דירוג לא חוקי" });
  }
  try {
    const trainer = await UserModel.findById(req.params.id);
    if (!trainer || trainer.role !== "trainer") {
      return res.status(404).json({ message: "מאמנת לא נמצאה" });
    }

    let found = false;
    if (!trainer.ratings) trainer.ratings = [];
    trainer.ratings = trainer.ratings.map((r) => {
      if (r.user.toString() === userId) {
        found = true;
        return { user: r.user, value: rating };
      }
      return r;
    });
    if (!found) {
      trainer.ratings.push({ user: userId, value: rating });
    }

    const avg = trainer.ratings.length
      ? trainer.ratings.reduce((sum, r) => sum + r.value, 0) / trainer.ratings.length
      : 0;

    trainer.rating = avg;
    await trainer.save();

    res.json({ message: "הדירוג נשמר!", rating: avg, ratingsCount: trainer.ratings.length });
  } catch (err) {
    res.status(500).json({ message: "שגיאת שרת", error: err.message });
  }
});

/* ======================= UPDATE USER ======================= */
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

      if (req.body.name) updates.name = req.body.name;
      if (req.body.email) updates.email = req.body.email;
      if (req.body.location) updates.location = req.body.location;
      if (req.body.phone) updates.phone = req.body.phone;
      if (req.body.whatsapp) updates.whatsapp = req.body.whatsapp;
      if (req.body.instagram) updates.instagram = req.body.instagram;
      if (req.body.role) updates.role = req.body.role;

      if (req.body.previousGyms !== undefined) {
        try {
          updates.previousGyms = typeof req.body.previousGyms === "string"
            ? JSON.parse(req.body.previousGyms)
            : req.body.previousGyms;
        } catch {
          updates.previousGyms = [];
        }
      }

      if (req.body.address) {
        try {
          const addressData = typeof req.body.address === "string" ? JSON.parse(req.body.address) : req.body.address;
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

      if (req.body.expertise) {
        try {
          if (typeof req.body.expertise === "string" && req.body.expertise.trim().startsWith("[")) {
            updates.expertise = JSON.parse(req.body.expertise);
          } else {
            updates.expertise = Array.isArray(req.body.expertise) ? req.body.expertise : [req.body.expertise];
          }
        } catch (e) {
          updates.expertise = [req.body.expertise];
        }
      }

      if (
        req.body.height || req.body.weight || req.body.bmi || req.body.bmiCategory ||
        req.body.wrist || req.body.ankle || req.body.hip || req.body.waist || req.body.shoulder
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

      const allowedBodyTypes = ["אקטומורף", "מזומורף", "אנדומורף"];
      let bodyTypeValue = null;
      let bodyTypeDescriptionValue = null;

      if (req.body.bodyType) {
        if (typeof req.body.bodyType === "object") {
          if (typeof req.body.bodyType.type === "string" && allowedBodyTypes.includes(req.body.bodyType.type)) {
            bodyTypeValue = req.body.bodyType.type;
          }
          if (typeof req.body.bodyType.description === "string") {
            bodyTypeDescriptionValue = req.body.bodyType.description;
          }
        } else if (typeof req.body.bodyType === "string" && allowedBodyTypes.includes(req.body.bodyType)) {
          bodyTypeValue = req.body.bodyType;
        }
      }

      if (typeof req.body.bodyTypeDescription === "string") {
        bodyTypeDescriptionValue = req.body.bodyTypeDescription;
      }

      if (bodyTypeValue !== null || bodyTypeDescriptionValue !== null) {
        updates.bodyType = { type: bodyTypeValue, description: bodyTypeDescriptionValue, lastCalculated: new Date() };
      }

      if (req.file?.path) {
        updates.image = req.file.path;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id, { $set: updates }, { new: true }
      ).populate("address");

      if (!updatedUser) throw new Error("User not found");
      res.send(updatedUser);
    } catch (error) {
      console.error("🔥 Error updating user:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
});

/* ======================= RECIPES ======================= */
router.post("/:id/favoriteRecipes", requireAuth, async (req, res) => {
  try {
    const { title, ingredients, instructions, tags } = req.body;
    const recipe = new RecipeModel({ title, ingredients, instructions, tags, createdBy: req.params.id });
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

router.get("/:id/favoriteRecipes", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate("favoriteRecipes");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favoriteRecipes);
  } catch (err) {
    console.error("שגיאה בשליפת מועדפים:", err.message);
    res.status(500).json({ message: "שגיאה בטעינת מועדפים" });
  }
});

router.delete("/:id/favoriteRecipes/:recipeId", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.favoriteRecipes = user.favoriteRecipes.filter((recipeId) => recipeId.toString() !== req.params.recipeId);
    await user.save();
    res.json({ message: "Recipe removed from favorites" });
  } catch (err) {
    console.error("שגיאה בהסרת מתכון מהמועדפים:", err.message);
    res.status(500).json({ message: "Failed to remove recipe from favorites" });
  }
});

/* ======================= FAVORITES ======================= */
router.put("/favorites", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    const { trainerId } = req.body;
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!trainerId) return res.status(400).json({ message: "Trainer ID required" });

    const exists = user.favoriteTrainers.includes(trainerId);
    if (exists) {
      user.favoriteTrainers = user.favoriteTrainers.filter((id) => id.toString() !== trainerId);
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
    if (!user) return res.status(404).json({ message: "User not found" });
    const favorites = Array.isArray(user.favoriteTrainers)
      ? user.favoriteTrainers.filter((trainer) => trainer && trainer.name)
      : [];
    res.json({ favorites });
  } catch (err) {
    console.error("🔥 Error in GET /favorites:", err);
    res.status(500).json({ message: "שגיאה בשליפת מועדפים", error: err?.message || "Unknown error", stack: err?.stack || null });
  }
});

/* ======================= SEARCH BY CITY ======================= */
router.get("/searchByCity", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ message: "יש להזין עיר" });
  try {
    const addresses = await AddressModel.find({ city: { $regex: city, $options: "i" } });
    const addressIds = addresses.map((a) => a._id);
    const users = await UserModel.find({
      address: { $in: addressIds },
      role: "trainer",
      trainerStatus: "approved",
    }).populate("address");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בחיפוש לפי עיר" });
  }
});

/* ======================= GET ALL USERS ======================= */
router.get("/", async (req, res) => {
  try {
    const users = await userController.read({ ...req.query });
    res.send(users);
  } catch (error) {
    res.status(500).send("Error getting users");
  }
});

/* ======================= DELETE USER ======================= */
router.delete("/:id", async (req, res) => {
  try {
    const user = await userController.readOne({ _id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const deletedUser = await userController.deleteOne({ _id: req.params.id });
    if (!deletedUser) return res.status(500).json({ message: "Failed to delete user" });
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

/* ======================= PUBLIC TRAINER PROFILE ======================= */
router.get("/public/:id", async (req, res) => {
  try {
    const trainer = await UserModel.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: "מאמנת לא נמצאה (לא נמצאה במסד)" });
    if (trainer.role !== "trainer") return res.status(404).json({ message: "מאמנת לא נמצאה (לא role=trainer)" });

    const publicFields = {
      name: trainer.name,
      image: trainer.image,
      address: trainer.address,
      expertise: trainer.expertise,
      rating: trainer.rating,
      experienceYears: trainer.experienceYears,
      previousGyms: trainer.previousGyms,
      instagram: trainer.instagram,
      bodyType: trainer.bodyType,
      whatsapp: trainer.whatsapp,
      phone: trainer.phone,
      email: trainer.email,
    };

    res.json(publicFields);
  } catch (err) {
    console.error("❌ שגיאה בנתיב ציבורי:", err.message);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

/* ======================= GET USER BY ID ======================= */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .populate("address")
      .select("+previousGyms");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user by ID:", err.message);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/* ======================= ADMIN RESET PASSWORD ======================= */
router.post("/admin-reset-password", requireAuth, requireRole(["admin", "superAdmin"]), async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) return res.status(400).json({ message: "חסרים פרטים" });
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

/* ======================= ADMIN SEND RESET LINK ======================= */
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

/* ======================= REFRESH TOKEN ======================= */
router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No token" });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const accessToken = jwt.sign({ id: payload.id, role: payload.role }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const user = await UserModel.findById(payload.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ token: accessToken, user });
  } catch (err) {
    console.error("❌ Refresh error:", err.message);
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

/* ======================= LOGOUT ======================= */
router.post("/logout", (req, res) => {
  // נשתמש באותם פרמטרים כמו בהגדרת העוגייה כדי להבטיח מחיקה
  const opts = cookieOpts();
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: opts.sameSite, secure: opts.secure });
  res.status(200).json({ message: "Logged out" });
});

/* ======================= ADMIN SIMPLE STATS ======================= */
router.get("/admin/simple-stats", requireAuth, requireRole(["superAdmin", "manager"]), async (req, res) => {
  const totalUsers = await UserModel.countDocuments({});
  const trainers = await UserModel.countDocuments({ role: "trainer" });
  const admins = await UserModel.countDocuments({ role: "admin" });
  const managers = await UserModel.countDocuments({ role: "manager" });

  const totalLoginsAgg = await UserModel.aggregate([
    { $group: { _id: null, total: { $sum: "$loginCount" } } }
  ]);
  const totalLogins = totalLoginsAgg[0]?.total || 0;

  const topLogins = await UserModel.find({}, "name email loginCount")
    .sort({ loginCount: -1 })
    .limit(5)
    .lean();

  res.json({ totalUsers, trainers, admins, managers, totalLogins, topLogins });
});

module.exports = router;
