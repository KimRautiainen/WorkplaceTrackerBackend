"use strict";
const express = require("express");
const router = express.Router();
const worklogController = require("../controllers/workLogController");
const { param, body, validationResult } = require("express-validator");
const authorizeUser = require("../middlewares/authMiddleware");
const upload = require("../multerConfig");

// Middleware for checking validation results and sending an error response if needed
const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

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
router.get(
  "/:userId",
  validatedUserId,
  checkValidationResult,
  worklogController.getWorklogById
);

// get worklog by user id for workareaId
router.get(
  "/:userId/:workareaId",
  [validatedUserId, validatedWorkareaId],
  checkValidationResult,
  worklogController.getWorkLogByIdForWorkareaId
);

// post users workLog
router.post(
  "/:userId/:workareaId",
  [
    validatedUserId,
    validatedWorkareaId,
  ],
  checkValidationResult,
  authorizeUser,
  upload,
  worklogController.postWorkLog
);

module.exports = router;
