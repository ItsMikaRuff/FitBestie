const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")


//add user

router.post("/", async (req,res)=>{
    try{
        const user = await userController.create(req.body)
        if(!user) throw {code: 500}
        res.send(user)
    }catch(err){
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
router.get("/:id",async (req,res)=>{
    try{
        const user = await userController.readOne({_id: req.params.id})
        if (!user) throw {code: 500};
        res.send(user);
    }catch (err){
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

  //update user
router.put("/:id", async (req, res) => {
    try {
      const user = await userController.update({ _id: req.params.id }, req.body);
      if (!user) throw "User not found";
      res.send(user);
    } catch (error) {
      res.status(500).send("Error creating user");
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