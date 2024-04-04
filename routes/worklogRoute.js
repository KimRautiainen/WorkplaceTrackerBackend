"use strict";
const express = require("express");
const router = express.Router();
const worklogController = require("../controllers/workLogController");
const { param, body, validationResult } = require("express-validator");
const authorizeUser = require("../middlewares/authMiddleware");

// Validate user id parameter
const validatedUserId = param("userId")
  .isInt()
  .withMessage("User ID must be an integer");

const validatedWorkareaId = param("workareaId")
  .isInt()
  .withMessage("Workarea ID must be an integer");

// get all worklogs
router.get("/", worklogController.getWorklogs);

// get worklog by user id
router.get("/:id", [validatedUserId], worklogController.getWorklogById);

// get worklog by user id for workareaId
router.get(
  "/:userId/:workareaId",
  [validatedUserId, validatedWorkareaId],
  worklogController.getWorkLogByIdForWorkareaId
);

module.exports = router;
