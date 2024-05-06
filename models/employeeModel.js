"use strict";
const pool = require("../Db");
const promisePool = pool.promise();

const getEmployeeById = async (id) => {
    try {
        const sql = `
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          picture,
          businessId, 
          address,
          created_at 
        FROM company WHERE id=?
      `;
        const [rows] = await promisePool.query(sql, [id]);
        return rows;
    } catch (e) {
        console.error("error", e.message);
        throw new Error("sql query failed");
    }
};

const getEmployeeLogin = async (email) => {
    try {
        console.log(email);
        const [rows] = await promisePool.execute(
            "SELECT * FROM company WHERE email = ?;",
            [email]
        );
        console.log("get employee login rows", rows);
        return rows;
    } catch (e) {
        console.log("error", e.message);
    }
};

const checkEmail = async (email) => {
    try {
        const sql = `SELECT * FROM company WHERE email = ?`;
        const [rows] = await promisePool.query(sql, [email]);
        return rows;
    } catch (e) {
        console.error("error", e.message);
        throw new Error("sql query failed");
    }
};

const insertEmployee = async (employee) => {
    try {
        const sql = `INSERT INTO company (businessId, name, address, email, phone, picture, password, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

        const [rows] = await promisePool.query(sql, [
            employee.businessId, // Assuming employee object has a businessId property
            employee.name, // Assuming employee object has a name property
            employee.address, // Assuming employee object has an address property
            employee.email, // Assuming employee object has an email property
            employee.phone, // Assuming employee object has a phone property
            employee.picture, // Assuming employee object has a picture property or path to picture
            employee.password, // Assuming employee object has a password property
        ]);
        return rows;
    } catch (e) {
        console.error("error", e.message);
        throw new Error("sql insert employee failed");
    }
};


module.exports = {
    getEmployeeById,
    getEmployeeLogin,
    checkEmail,
    insertEmployee,
};