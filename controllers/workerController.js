"use strict";
const e = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create new user
const postUser = async (req, res) => {
  console.log("posting user", req.body, req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if email is already in use
  const emailExists = await userModel.checkEmail(req.body.email);
  if (emailExists.length > 0) {
    if (req.file) {
      const filePath = path.join(__dirname, "../uploads/", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    return res.status(409).json({ message: "Email already in use" });
  }

  // Generate a salt with bcrypt
  const salt = await bcrypt.genSalt(10);
  // Hash the user's password using bcrypt and the generated salt
  const password = await bcrypt.hash(req.body.password, salt);

  // Construct the new worker object
  const worker = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    picture: req.file ? req.file.filename : "", // Handle the case where a file might not be uploaded
    salary: req.body.salary,
    password: password, // Hashed password for storage
    
  };

  try {
    // Insert the new worker into the database
    const result = await userModel.insertWorker(worker);
    res.status(201).json({ message: "Worker created" });

    // Further steps would include associating the worker with companies, departments, and positions
    // These could be handled through additional API endpoints or application logic
  } catch (error) {
    console.error("error", error.message);
    res.status(500).json({
      error: 500,
      message: error.message,
    });
  }
};
// Check token
const checkToken = (req, res) => {
  res.json({ user: req.user });
};

// get all users 
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get user by id
const getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get user by workArea id
const getUsersByWorkArea = async (req, res) => {
  try {
    const users = await userModel.getUsersByWorkArea(req.params.workAreaId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get user and is_active by workArea id and user id
const getUserWorkAreaController = async (req, res) => {
  const { workAreaId, userId } = req.params;  // Assuming these are passed as URL parameters

  try {
      const userWorkAreaDetails = await userModel.getUserWorkArea(workAreaId, userId);
      if (userWorkAreaDetails) {
          res.json(userWorkAreaDetails);
      } else {
          res.status(404).send({ message: "User not found in the specified work area or not active." });
      }
  } catch (error) {
      console.error("Failed to retrieve user details:", error);
      res.status(500).send({ message: "Internal server error when attempting to fetch user details." });
  }
};

module.exports = {
  postUser,
  checkToken,
  getUsers,
  getUserById,
  getUsersByWorkArea,
  getUserWorkAreaController
};
