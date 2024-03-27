'use strict';
const express = require('express');
const cors = require('cors');
const app = express();


// Log middleware
app.use((req, res, next) => {
    console.log(Date.now() + ": request: " + req.method + "" + req.path);
    next();
  });
  
  // Add cors headers using cors middleware
  app.use(cors());
  
  module.exports = app;