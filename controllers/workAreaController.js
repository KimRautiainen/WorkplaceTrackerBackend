"use strict";
const workAreaModel = require("../models/workAreaModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const getWorkAreas = async (req, res) => {
  try {
    const [rows] = await workAreaModel.getWorkAreas();
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json(err);
  }
};
const getWorkAreaById = async (req, res) => {
  try {
    const [rows] = await workAreaModel.getWorkAreaById(req.params.id);
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json(err);
  }
};
const getWorkAreasForUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is passed as a URL parameter
    const workAreas = await workAreaModel.getWorkAreasForUser(userId);
    res.json(workAreas);
  } catch (error) {
    console.error("Error in getWorkAreasForUser controller:", error);
    res.status(500).send("Internal server error");
  }
};
const createWorkArea = async (req, res) => {
  try {
    const workArea = {
      company_id: req.body.company_id,
      name: req.body.name,
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      radius: req.body.radius,
    };
    const result = await workAreaModel.createWorkArea(workArea);
    res.status(201).json({ message: "Work area created successfully", accessCode: result.access_code });
  } catch (error) {
    console.error("Error in createWorkArea controller:", error);
    res.status(500).send("Internal server error");
  }
};


const reguestJoinWorkArea = async (req, res) => {
  const userId = req.params.userId;
  const access_code = req.body.access_code;
  try {
    const workArea = await workAreaModel.findByAccessCode(access_code);
    if (!workArea) {
      return res.status(404).json({ message: "Invalid access code" });
    }
    const joinExists = await workAreaModel.checkExistingJoinRequest(userId, workArea.id);
    if (joinExists) {
      return res.status(409).json({ message: "Join request already exists." });
    }
    const result = await workAreaModel.requestJoinWorkArea(userId, workArea.id);
    res.status(201).json({ message: "Join request sent. Waiting for approval." });
  } catch (error) {
    console.error("Error in requestJoinWorkArea controller:", error);
    res.status(500).send("Internal server error");
  }
};

const approveJoinRequest = async (req, res) => {
  const { workerId, workAreaId } = req.body;
  try {
    const updateResult = await workAreaModel.approveJoinRequest(workerId, workAreaId);
    if (updateResult.affectedRows > 0) {
      res.json({ message: "Work area join request approved successfully." });
    } else {
      res.status(404).json({ message: "No pending request found for this worker and work area." });
    }
  } catch (error) {
    console.error("Error in approveJoinRequest controller:", error);
    res.status(500).send("Internal server error");
  }
};

const linkWorkerToCompany = async (workerId, companyId) => {
  const exists = await workAreaModel.checkWorkerCompanyLink(workerId, companyId);
  if (!exists) {
    await workAreaModel.createWorkerCompanyLink(workerId, companyId);
  }
};

// get all workArea join requests
const getJoinRequests = async (req, res) => {
  try {
    const joinRequests = await workAreaModel.getJoinRequests();
    console.log("joinRequests", joinRequests);
    res.json(joinRequests);
    console.log("joinRequests", joinRequests);
  } catch (error) {
    console.error("Error in getJoinRequests controller:", error);
    res.status(500).send("Internal server error");
  }
};
// get workArea by company id
const getWorkAreasByCompanyId = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const workAreas = await workAreaModel.getWorkAreasByCompanyId(companyId);
    res.json(workAreas);
  } catch (error) {
    console.error("Error in getWorkAreasByCompanyId controller:", error);
    res.status(500).send("Internal server error");
  }
};
// delete workAreaRequest
const deleteRequest = async (req, res) => {
  try {
    const workerId = req.params.workerId;
    const workAreaId = req.params.workAreaId;
    const result = await workAreaModel.deleteRequest(workerId, workAreaId);
    if (result.affectedRows > 0) {
      res.json({ message: "Request deleted successfully." });
    } else {
      res.status(404).json({
        message: "No pending request found for this worker and work area.",
      });
    }
  } catch (error) {
    console.error("Error in deleteRequest controller:", error);
    res.status(500).send("Internal server error");
  }
};
module.exports = {
  getWorkAreas,
  getWorkAreaById,
  getWorkAreasForUser,
  createWorkArea,
  reguestJoinWorkArea,
  approveJoinRequest,
  getJoinRequests,
  getWorkAreasByCompanyId,
  deleteRequest,
  linkWorkerToCompany,
};
