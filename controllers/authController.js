"use strict";
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();
const { validationResult } = require('express-validator');

const login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log("login req.body", req.body);
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            console.log("info: ", info);
            console.log("user: ", user);
            return res.status(400).json({
                message: 'Username / password wrong',
            });
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.json({message: err, errorlocation: "login"});
            }
            // generate a signed json web token with the contents of user object and return it in the response
            const token = jwt.sign(user, process.env.JWT_SECRET);
            return res.json({user, token});
        });
    })(req, res);
};
const logout = (req, res) => {
    // client log out itself by removing the token from local/session storage
    res.json({message: 'logged out'});
};
module.exports = {
    login, logout
};