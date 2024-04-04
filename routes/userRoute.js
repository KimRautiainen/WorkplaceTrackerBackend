"use strict";
const express = require("express");
const router = express.Router();
const userController = require("../controllers/workerController");
const { param, body, validationResult } = require("express-validator");
const authorizeUser = require('../middlewares/authMiddleware')


// Check token
router.get("/token", userController.checkToken);


module.exports = router;