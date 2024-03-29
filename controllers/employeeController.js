"use strict";
const employeeModel = require("../models/employeeModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const postEmployee = async (req, res) => {
    console.log("posting employee", req.body, req.file);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check if email is already in use
    const employeeEmailExists = await employeeModel.checkEmail(req.body.email);
    if (employeeEmailExists.length > 0) {
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

    // Construct the new employee object
    const employee = {
        businessId: req.body.businessId,
        name: req.body.name,
        address: req.body.address,
        picture: req.file ? req.file.filename: "", // Handle the case where a file might not be uploaded
        phone: req.body.phone,
        email: req.body.email,
        password: password, // Hashed password for storage
    };

    try {
        // Insert the new employee into the database
        const result = await employeeModel.insertEmployee(employee);
        res.status(201).json({ message: "Employee created" });
    } catch (error) {
        console.error("error", error.message);
        res.status(500).json({
            error: 500,
            message: error.message,
        });
    }
};

module.exports = {
    postEmployee,
};