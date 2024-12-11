const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.controller")


//add user

router.post("/addUser", async (req,res)=>{
    try{
        const user = await userController.create(req.body)
        if(!user) throw {code: 500}
        res.send(user)
    }catch(err){
        res.status(500).send("Error creating user")
    }
})

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