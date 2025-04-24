const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
// const upload = multer({ dest: "uploads/" });
// const path = require("path");


// configure cloud storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "fitbestie_users", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// // סינון קבצים (תמונות וסרטונים בלבד)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("סוג קובץ לא נתמך"), false);
//   }
// };

//add user
router.post("/", async (req, res) => {
  try {
    const user = await userController.create(req.body)
    if (!user) throw { code: 500 }
    res.send(user)
  } catch (err) {
    res.status(500).send("Error creating user")
  }
})

// login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userController.readOne({ email });

    if (!user) {
      return res.status(401).send("User not found");
    }

    // השוואת סיסמה פשוטה (אם את משתמשת בהאש, תצטרכי bcrypt)
    if (user.password !== password) {
      return res.status(401).send("Invalid password");
    }

    // אם הכל תקין - מחזירים את המשתמש
    res.send(user);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Error logging in");
  }
});

//get user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await userController.readOne({ _id: req.params.id })
    if (!user) throw { code: 500 };
    res.send(user);
  } catch (err) {
    res.status(500).send("Error creating user")
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    req.query;
    const users = await userController.read({ ...req.query });
    res.send(users);
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});


// update user
router.post("/update/:id", upload.single("image"), async (req, res) => {

  console.log("התקבל עדכון משתמש:", req.params.id);  // 🔴 תוסיפי שורה זו לבדיקה
  console.log(">>> req.body:", req.body);
  console.log(">>> req.file:", req.file);

  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
    };

    // אם יש קובץ מצורף, נוסיף אותו
    if (req.file && req.file.path) {
      updates.image = req.file.path; // this will be a public Cloudinary URL
    }

    const user = await userController.update({ _id: req.params.id }, updates);

    console.log(">>> updates to apply:", updates);
    console.log(">>> updated user:", user);

    if (!user) throw "User not found";

    res.send(user); // שלח את המידע המעודכן חזרה

  } catch (error) {
    console.error("Error updating user with file:", error);
    res.status(500).send("Error updating user");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await userController.deleteOne({ _id: req.params.id });
    if (!user) throw "User not found";
    res.send(user);
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});

module.exports = router;