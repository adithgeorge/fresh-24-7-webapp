
const jwt = require("jsonwebtoken"); // To generate signed token
const expressJwt = require("express-jwt"); // For authorisation check
const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");

const signup = (req, res) => {
    console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if(err)
        {   
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({
            user
        });
    });

}

const signin = (req, res) => {
    // Find the user based on email

    const { email, password } = req.body;
    User.findOne( { email }, (err, user) => {
        if(err || !user)
        {
            return res.status(400).json({
                error: 'User with the input email does not exist. Please signup.'
            })
        }
        // If user is found make sure that email and passwords match
        // Create authenticate method in user model

        if(!user.authenticate(password)) {
            return res.status(401).json(
                {
                    error: 'Email and passwords do not match'
                }
            )
        }


        // Generate signed token with user id and secret
        const token = jwt.sign(
            {
            _id: user._id
        }
        , `${process.env.JWT_SECRET}`);

        // Had to put the JWT_SECRET in backticks

        // Once we have the token, then we can persist the token in cookie with expiry date
        res.cookie('token', token, {expire: new Date() + 9999})

        // Return response with user and token to frontend client

        const { _id, name, email, role } = user;
        return res.json(
            {
                token, user: {
                    _id, email, name, role
                }
            }
        )

    })
}

const signout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Signout Sucess "})
}

const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
  });


const isAuth = (req, res, next) => {

    let user = req.profile && req.auth && req.profile._id == req.auth._id;

    if(!user)
    {
        return res.status(403).json({
            error: 'Access Denied'
        })
    }

    next();

}

const isAdmin = (req, res, next) => {

    if(req.profile.role === 0)
    {
        return res.status(403).json({
            error: 'For Admin Resource Only! Access Denied'
        })
    }

    next();
}



module.exports = { signup, signin, signout, requireSignin, isAuth, isAdmin}