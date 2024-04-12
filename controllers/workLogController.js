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
    const worklog = await workLogModel.getWorklogById(req.params.userId);
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

// post users workLog
const postWorkLog = async (req, res) => {
  console.log("posting worklog", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
      // Fetch company_id using workArea_id from the request parameters
      const company_id = await workLogModel.getCompanyIdByWorkAreaId(req.params.workareaId);

      // Destructure the rest of the worklog details from the request body
      const { start_time, end_time, hours_worked, date_recorded, work_type, comment, photo_url } = req.body;

      // Construct the worklog object with all necessary details
      const worklog = {
          worker_id: req.params.userId,
          company_id: company_id, // Use the company_id fetched above
          workArea_id: req.params.workareaId,
          start_time,
          end_time,
          hours_worked,
          date_recorded,
          work_type,
          comment,
          photo_url,
      };

      // Insert the new worklog into the database
      const result = await workLogModel.insertWorkLog(worklog);
      res.status(201).json({ message: "Worklog created successfully", worklogId: result.insertId });
  } catch (error) {
      console.error("Error posting worklog:", error.message);
      res.status(500).json({ error: error.message });
  }
};
// get all worklogs for companyId
const getWorklogsByCompanyId = async (req, res) => {
  try {
    const worklogs = await workLogModel.getWorklogsByCompanyId(req.params.companyId);
    res.json(worklogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getWorklogs,
  getWorklogById,
  getWorkLogByIdForWorkareaId,
  postWorkLog, 
  getWorklogsByCompanyId,
};
