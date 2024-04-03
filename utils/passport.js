"use strict";
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const { getUserLogin, getUserById } = require("../models/userModel");
const {
  getEmployeeLogin,
  getEmployeeById,
} = require("../models/employeeModel");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcryptjs");

require("dotenv").config();

// local strategy for username password login
passport.use(
  "local-user",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      console.log("login credentials", email, password);
      try {
        const [user] = await getUserLogin(email);
        console.log("Local strategy", user); // result is binary row
        if (user === undefined) {
          return done(null, false, { message: "Incorrect email." });
        }
        const loginOK = await bcrypt.compare(password, user.password);
        if (!loginOK) {
          return done(null, false, { message: "Incorrect password." });
        }
        // use spread syntax to create shallow copy to get rid of binary row type
        return done(null, { ...user }, { message: "Logged In Successfully" });
      } catch (err) {
        console.log("passport error", err);
        return done(err);
      }
    }
  )
);

// local strategy for employee login
passport.use(
  "local-employee",
  new Strategy(
    {
      usernameField: "email", // Specify the name of the field for the username (email in this case)
      passwordField: "password", // Specify the name of the field for the password
    },
    async (email, password, done) => {
      console.log("login credentials", email, password);
      try {
        const [employee] = await getEmployeeLogin(email);
        console.log("Local strategy", employee); // result is binary row
        if (employee === undefined) {
          return done(null, false, { message: "Incorrect email." });
        }
        const loginOK = await bcrypt.compare(password, employee.password);
        if (!loginOK) {
          return done(null, false, { message: "Incorrect password." });
        }
        // use spread syntax to create shallow copy to get rid of binary row type
        return done(
          null,
          { ...employee },
          { message: "Logged In Successfully" }
        );
      } catch (err) {
        console.log("passport error", err);
        return done(err);
      }
    }
  )
);

// JWT strategy for user
passport.use(
  'jwt-user',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      // Get user data from DB using userModel
      console.log("user from token", jwtPayload);
      try {
        const user = await getUserById(jwtPayload.userId);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT strategy for employee
passport.use(
  'jwt-employee',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      // Get employee data from DB using employeeModel
      console.log("employee from token", jwtPayload);
      try {
        const employee = await getEmployeeById(jwtPayload.userId);
        return done(null, employee);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;
