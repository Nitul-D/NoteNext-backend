const express = require("express");
const User = require("../models/User");
const router = express.Router();
const {body, validationResult} = require('express-validator');
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require ("../middleware/fetchuser")

const JWT_SECRET = process.env.JWT_SECRET;

//Route1: create a user using: POST "/api/auth/createuser". No login required
router.post("/createuser", [
    body("name", "Enter a valid Name").isLength({min : 4}),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be atleast 8 character").isLength({min : 8}),
], async (req, res) => {
   let success = false;
    //if there are errors, return bad request and error code
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array()});
   }
try {
    //check whether the user email exist already
    let user = await User.findOne({email: req.body.email});
    if (user) {
      return res.status(500).json({success, error: "User with this email already exists"});
    }

    //secured for encryption
    const salt = await bcrypt.genSalt(10);
    securedPass = await bcrypt.hash(req.body.password, salt);

    //create new user
    user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: securedPass,
   });

   const data = {
    user : {
        id: user.id,
    }
   }
   const authToken = jwt.sign(data, JWT_SECRET);
   success = true;
   res.json({success, authToken})
//    res.json(user);
} catch (error) {
    res.status(500).json({success, error: "Internal Server Error"});
}

});


//Route2: Authenticate a user using: POST "/api/auth/login". No login required
router.post("/login", [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false;
    //if there are errors, return bad request and error code
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if (!user){
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare){
            return res.status(400).json({success, error: "Please try to login with correct credentials"});

        }

        const data = {
            user : {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken})
    } catch (error) {
        res.status(500).json({success, error: "Internal Server Error"});
    }
});

//Route3: Get loggin user details using: POST "/api/auth/getuser". login required

router.post("/getuser", fetchuser, async (req, res) => {
    let success = false;
try{
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)

} catch (error) {
    console.error(error.message);
    res.status(500).json({success, error: "Internal Server Error"});
}
});

module.exports = router;
