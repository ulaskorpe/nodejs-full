const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
 
const {User ,validateRegister,validateLogin} = require("../models/user");

router.get("/", async  (req,res)=>{
    const users = await User.find();

    res.send(users);
})


 // api/users : POST
router.post("/create", async (req, res) => {
    const { error } = validateRegister(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });

    if(user) {
        return res.status(400).send("email already taken");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        isAdmin :req.body.isAdmin
    });

    await user.save();
    const token = user.createAuthToken();

    res.header("x-auth-token", token).send(user);
});

router.post("/auth", async (req, res) => {
    const { error } = validateLogin(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if(!user) {
        return res.status(400).send("email not found");
    }

    const isSuccess = await bcrypt.compare(req.body.password, user.password);
    if(!isSuccess) {
        return res.status(400).send("password error");
    }

  // const token =  jwt.sign( { _id : user._id},'jwtPrivateKey');
     const token = user.createAuthToken();
    res.send(token);
})


router.put("/:id", async  (req,res)=>{
   
})

router.delete("/:id", async  (req,res)=>{
   
});



module.exports = router;