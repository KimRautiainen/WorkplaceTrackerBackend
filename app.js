"use strict";
const express = require("express");
const cors = require("cors");
const passport = require("./utils/passport");
const authRoute = require("./routes/authRoute");
const app = express();

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

// Add routes that require jwt strategy ->

module.exports = app;
