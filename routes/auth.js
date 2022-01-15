const express = require("express");
const router = express.Router();

const { signup, signin, signout, requireSignin } = require("../controllers/auth");
const { userSignUpValidator } = require("../validator");

//  userSignUpValidator is based on express validator middleware

router.post("/signup", userSignUpValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout );

router.get('/hello', requireSignin , (req, res) => {
    res.send("Hello There!")
})


module.exports = router;