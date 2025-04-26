const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");


// configure cloud storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "fitbestie_users", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // optional transformations
  },
});

// console.log("Cloudinary config:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "MISSING"
// });

const upload = multer({ storage });

//add user
router.post("/", async (req, res) => {
  try {
    const user = await userController.create(req.body)
    // if (!user) throw { code: 500 }
    res.send(user)
  } catch (err) {
    console.log("error from controller", err.code)
    res.status(500).send({message:"Error creating user", code: err.code})
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

router.post("/update/:id", (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("🧨 Multer error:", err);
      return res.status(500).json({ message: "Multer error", error: err.message });
    }

    console.log("📤 Update route hit");
    console.log(">>> req.params:", req.params);
    console.log(">>> req.body:", req.body);
    console.log(">>> req.file:", req.file);

    try {
      const updates = {
        name: req.body.name,
        email: req.body.email,
        location: req.body.location,
        phone: req.body.phone,
        whatsapp: req.body.whatsapp,
        instagram: req.body.instagram,
      };

      // Handle expertise if it exists in the request
      if (req.body.expertise) {
        try {
          updates.expertise = JSON.parse(req.body.expertise);
        } catch (e) {
          console.error("Error parsing expertise:", e);
          updates.expertise = req.body.expertise;
        }
      }

      if (req.file && req.file.path) {
        updates.image = req.file.path;
      }

      const user = await userController.update({ _id: req.params.id }, updates);
      if (!user) throw new Error("User not found");

      res.send(user);
    } catch (error) {
      console.error("🔥 Error updating user:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
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