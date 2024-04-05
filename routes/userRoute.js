"use strict";
const express = require("express");
const router = express.Router();
const userController = require("../controllers/workerController");
const { param, body, validationResult } = require("express-validator");
const authorizeUser = require('../middlewares/authMiddleware')


// Check token
router.get("/token", userController.checkToken);

// get all users
router.get("/", userController.getUsers);

// get user by id
router.get("/:id", userController.getUserById);



module.exports = router;