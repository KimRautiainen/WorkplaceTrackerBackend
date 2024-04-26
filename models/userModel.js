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
    const salary =
      worker.salary !== null && worker.salary !== undefined
        ? worker.salary
        : 0.0;

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

// get all users from the database
const getUsers = async () => {
  try {
    const [rows] = await promisePool.execute("SELECT * FROM worker");
    return rows;
  } catch (e) {
    console.log("error", e.message);
    throw new Error("sql query failed", e);
  }
};

// get users by workArea id
const getUsersByWorkArea = async (workAreaId) => {
  try {
    const sql = `
    SELECT w.*, wwa.is_active
    FROM worker w
    JOIN worker_workArea wwa ON w.id = wwa.worker_id
    WHERE wwa.workArea_id = ? AND wwa.approved = 1
    ORDER BY wwa.is_active DESC, w.name ASC;
    `;
    const [rows] = await promisePool.query(sql, [workAreaId]);
    return rows;
  } catch (error) {
    console.error("Error fetching users by workAreaId:", error);
    throw new Error("Failed to retrieve users for the work area");
  }
};

// get user and is_active by workArea id and user id
const getUserWorkArea = async (workAreaId, userId) => {
  try {
    const sql = `
      SELECT 
        w.id, 
        w.name, 
        w.picture, 
        waw.is_active as isActive, 
        wa.name as currentWorkAreaName
      FROM 
        worker w
        LEFT JOIN worker_workArea waw ON w.id = waw.worker_id
        LEFT JOIN workArea wa ON waw.workArea_id = wa.id
      WHERE 
        waw.workArea_id = ? AND
        w.id = ? AND
        waw.is_active = 1 
    `;
    const [rows] = await promisePool.query(sql, [workAreaId, userId]);
    return rows[0]; // Assuming you are fetching details for one user
  } catch (error) {
    console.error("Error fetching user by workAreaId and userId:", error);
    throw new Error("Failed to retrieve user for the work area");
  }
};

module.exports = {
  getUserById,
  getUserLogin,
  checkEmail,
  insertWorker,
  getUsers,
  getUsersByWorkArea,
  getUserWorkArea,
};
