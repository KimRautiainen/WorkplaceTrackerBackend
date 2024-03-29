"use strict";
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { login, logout } = require("../controllers/authController");
const { postUser } = require("../controllers/workerController");
const { postEmployee } = require("../controllers/employeeController");
const handleUserUpload = require("../middlewares/uploadMiddleware");
const handleEmployeeUpload = require("../middlewares/employeeUploadMiddleware");

// Worker routes
router.post(
  "/login",
  [
    body("email", "email is required").not().isEmpty(),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
      max: 30,
    }),
  ],
  login
);

router.get("/logout", logout);

router.post("/register", handleUserUpload, postUser);

// Employee routes
router.post(
    "/employee/login",
[
        body("email", "email is required").not().isEmpty(),
        body("password", "Password must be at least 5 characters long").isLength({
        min: 5,
        max: 30,
        }),
    ],
    login
    );

router.get("/employee/logout", logout);

router.post("/employee/register", handleEmployeeUpload, postEmployee);

module.exports = router;