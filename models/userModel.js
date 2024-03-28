"use strict";
const pool = require("../Db");
const promisePool = pool.promise();

const getUserById = async (id) => {
    try {
      const sql = `
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          picture, 
          salary,
          created_at 
        FROM worker WHERE id=?
      `;
      const [rows] = await promisePool.query(sql, [id]);
      return rows;
    } catch (e) {
      console.error("error", e.message);
      throw new Error("sql query failed");
    }
  };

const getUserLogin = async (email) => {
  try {
    console.log(email);
    const [rows] = await promisePool.execute(
      "SELECT * FROM worker WHERE email = ?;",
      [email]
    );
    console.log("get user login rows", rows);
    return rows;
  } catch (e) {
    console.log("error", e.message);
  }
};

const checkEmail = async (email) => {
    try {
      const sql = `SELECT * FROM worker WHERE email = ?`;
      const [rows] = await promisePool.query(sql, [email]);
      return rows;
    } catch (e) {
      console.error("error", e.message);
      throw new Error("sql query failed");
    }
  };

  const insertWorker = async (worker) => {
    try {
      const sql = `INSERT INTO worker (name, email, phone, picture, salary, password, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
  
      // Validate salary; use default value of 0.00 if null or undefined
      const salary = worker.salary !== null && worker.salary !== undefined ? worker.salary : 0.00;
  
      const [rows] = await promisePool.query(sql, [
        worker.name, // Assuming worker object has a name property
        worker.email, // Assuming worker object has an email property
        worker.phone, // Assuming worker object has a phone property
        worker.picture, // Assuming worker object has a picture property or path to picture
        salary, // Use validated or default salary value
        worker.password, // Assuming worker object has a password property
      ]);
      return rows;
    } catch (e) {
      console.error("error", e.message);
      throw new Error("sql insert worker failed");
    }
  };
  

module.exports = {
    getUserById,
    getUserLogin,
    checkEmail,
    insertWorker,
};