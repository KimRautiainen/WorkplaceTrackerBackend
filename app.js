"use strict";
const express = require("express");
const cors = require("cors");
const passport = require("./utils/passport");
const authRoute = require("./routes/authRoute");
const app = express();
const userRoute = require("./routes/userRoute");
const { authenticateDualStrategy } = require("./middlewares/dualAuthMiddleware");

// Log middleware
app.use((req, res, next) => {
  console.log(Date.now() + ": request: " + req.method + "" + req.path);
  next();
});

// Add cors headers using cors middleware
app.use(cors());

// Serve image files
app.use("/uploads", express.static("uploads"));

// Middleware for parsing request body
app.use(express.json());

// Middleware for parsing URL-encoded request bodies with extended options.
app.use(express.urlencoded({extended: true}));

// Initialize Passport for authentication.
app.use(passport.initialize());

// Use the authRoute for handling authentication-related routes
app.use('/auth', authRoute);

// user routes
app.use('/user', passport.authenticate('jwt-user', {session: false}), userRoute);

// Use the worklogRoute for handling worklog-related routes
app.use('/worklogs', passport.authenticate('jwt-user', {session: false}), require('./routes/worklogRoute'));

// Use the workAreaRoute for handling workArea-related routes
app.use('/workAreas', authenticateDualStrategy, require('./routes/workAreaRoute'));


module.exports = app;
