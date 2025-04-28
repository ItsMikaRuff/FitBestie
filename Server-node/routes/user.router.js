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
      const updates = {};

      // Handle basic user info
      if (req.body.name) updates.name = req.body.name;
      if (req.body.email) updates.email = req.body.email;
      if (req.body.location) updates.location = req.body.location;
      if (req.body.phone) updates.phone = req.body.phone;
      if (req.body.whatsapp) updates.whatsapp = req.body.whatsapp;
      if (req.body.instagram) updates.instagram = req.body.instagram;
      if (req.body.role) updates.role = req.body.role;

      // Handle address
      if (req.body.address) {
        try {
          const addressData = JSON.parse(req.body.address);
          // Ensure all required fields are present
          updates.address = {
            street: addressData.street || '',
            city: addressData.city || '',
            state: addressData.state || '',
            country: addressData.country || '',
            zipCode: addressData.zipCode || '',
            coordinates: {
              lat: addressData.coordinates?.lat || null,
              lng: addressData.coordinates?.lng || null
            }
          };
          console.log("Parsed address data:", updates.address);
        } catch (e) {
          console.error("Error parsing address:", e);
          // If parsing fails, try to use the raw address data
          updates.address = req.body.address;
        }
      }

      // Handle expertise if it exists in the request
      if (req.body.expertise) {
        try {
          updates.expertise = JSON.parse(req.body.expertise);
        } catch (e) {
          console.error("Error parsing expertise:", e);
          updates.expertise = req.body.expertise;
        }
      }

      // Handle measurements
      if (req.body.height || req.body.weight || req.body.bmi || req.body.bmiCategory || 
          req.body.wrist || req.body.ankle || req.body.hip || req.body.waist || req.body.shoulder) {
        
        // Create new measurements object with only the sent fields
        const measurements = {};
        
        // Update only the fields that were sent
        if (req.body.height) measurements.height = Number(req.body.height);
        if (req.body.weight) measurements.weight = Number(req.body.weight);
        if (req.body.bmi) measurements.bmi = Number(req.body.bmi);
        if (req.body.bmiCategory) measurements.bmiCategory = req.body.bmiCategory;
        if (req.body.wrist) measurements.wrist = Number(req.body.wrist);
        if (req.body.ankle) measurements.ankle = Number(req.body.ankle);
        if (req.body.hip) measurements.hip = Number(req.body.hip);
        if (req.body.waist) measurements.waist = Number(req.body.waist);
        if (req.body.shoulder) measurements.shoulder = Number(req.body.shoulder);
        
        // Update lastUpdated only if we have new measurements
        measurements.lastUpdated = new Date();
        
        // Update the measurements object in the updates
        updates.measurements = measurements;
      }

      // Handle body type
      if (req.body.bodyType || req.body.bodyTypeDescription) {
        updates.bodyType = {
          type: req.body.bodyType || null,
          description: req.body.bodyTypeDescription || null,
          lastCalculated: new Date()
        };
      }

      if (req.file && req.file.path) {
        updates.image = req.file.path;
      }

      console.log("Final updates object:", updates);

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
    // Get user before deletion to verify it exists
    const user = await userController.readOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
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


// Search trainers by location
router.get("/search", async (req, res) => {
  try {
      const { type } = req.query;
      
      // Build the search query
      const query = {
          role: type || 'trainer' // אם לא צוין type, מחפש מאמנים
      };

      // Search for trainers
      const results = await userController.searchByTypeAndLocation(query);
      console.log('Search results:', results); // Add logging
      res.json(results);
  } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Error searching for trainers" });
  }
});


module.exports = router;