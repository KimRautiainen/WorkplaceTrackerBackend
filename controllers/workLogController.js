"use strict";
const e = require("express");
const workLogModel = require("../models/worklogModel")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// get all worklogs
const getWorklogs = async (req, res) => {
  try {
    const worklogs = await workLogModel.getWorklogs();
    res.json(worklogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// get worklog by id
const getWorklogById = async (req, res) => {
  try {
    const worklog = await workLogModel.getWorklogById(req.params.id);
    res.json(worklog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get worklog by id for workareaId
const getWorkLogByIdForWorkareaId = async (req, res) => {
  try {
    const worklog = await workLogModel.getWorkLogByIdForWorkareaId(req.params.userId, req.params.workareaId);
    res.json(worklog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getWorklogs,
  getWorklogById,
  getWorkLogByIdForWorkareaId,
};
