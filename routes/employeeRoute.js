"use strict";
const express = require("express");
const router = express.Router();
/* const employee = require("../controllers/workerController"); */
const employeeController = require("../controllers/employeeController");
const { param, body, validationResult } = require("express-validator");
const authorizeUser = require('../middlewares/authMiddleware')

// get employee by id
router.get("/:id", employeeController.getEmployeeById);

module.exports = router;