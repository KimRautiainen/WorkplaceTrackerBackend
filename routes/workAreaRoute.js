"use strict";
const express = require("express");
const router = express.Router();
const workAreaController = require("../controllers/workAreaController");
const { param, body, validationResult } = require("express-validator");
const authorizeUser = require("../middlewares/authMiddleware");
const upload = require("../multerConfig");

const workAreaValidation = [

];
// approve workArea join request
router.post("/approveJoinRequest", workAreaController.approveJoinRequest);

// get all workArea join requests
router.get("/pending", workAreaController.getJoinRequests);

// get all workAreas
router.get("/", workAreaController.getWorkAreas);

// get workArea by id
router.get("/:id", workAreaController.getWorkAreaById);

// get workArea by user id 
router.get("/userWorkAreas/:userId", workAreaController.getWorkAreasForUser);


// create workArea
router.post("/", workAreaController.createWorkArea);

router.post("/reguestJoinWorkArea/:userId", authorizeUser, workAreaController.reguestJoinWorkArea);

// get workArea by company id
router.get("/company/:companyId", workAreaController.getWorkAreasByCompanyId);


module.exports = router;
