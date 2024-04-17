"use strict";
const pool = require("../Db");
const promisePool = pool.promise();
const crypto = require('crypto');


const getWorkAreas = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM workArea");
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
};
const getWorkAreaById = async (id) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM workArea WHERE id = ?",
      [id]
    );
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
};

const getWorkAreasForUser = async (userId) => {
  try {
    const query = `
            SELECT wa.* FROM workArea wa
            JOIN worker_workArea wwa ON wa.id = wwa.workArea_id
            WHERE wwa.worker_id = ? AND wwa.approved = 1
        `;
    const [rows] = await promisePool.execute(query, [userId]);
    return rows;
  } catch (error) {
    console.error("Error in getWorkAreasForUser:", error);
    throw error;
  }
};

const generateUniqueAccessCode = async () => {
  let isUnique = false;
  let access_code;
  while (!isUnique) {
    access_code = crypto.randomBytes(8).toString("hex");
    const [rows] = await promisePool.query(
      "SELECT id FROM workArea WHERE access_code = ?",
      [access_code]
    );
    if (rows.length === 0) {
      isUnique = true;
    }
  }
  return access_code;
};

const createWorkArea = async (workAreaDetails) => {
  const { company_id, name, description, latitude, longitude, radius } =
    workAreaDetails;
  const access_code = await generateUniqueAccessCode();

  try {
    const query = `
      INSERT INTO workArea (company_id, name, description, latitude, longitude, radius, access_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await promisePool.execute(query, [
      company_id,
      name,
      description,
      latitude,
      longitude,
      radius,
      access_code,
    ]);
    return result;
  } catch (error) {
    console.error("Error in createWorkArea:", error);
    throw error;
  }
};
const requestJoinWorkArea = async (workerId, workAreaId) => {
  try {
    const query = `
      INSERT INTO worker_workArea (worker_id, workArea_id, is_active)
      VALUES (?, ?, 0)
    `;
    const [result] = await promisePool.execute(query, [workerId, workAreaId]);
    return result;
  } catch (error) {
    console.error("Error in requestJoinWorkArea:", error);
    throw error;
  }
};
const approveJoinRequest = async (workerId, workAreaId) => {
  try {
    const query = `
            UPDATE worker_workArea
            SET approved = TRUE
            WHERE worker_id = ? AND workArea_id = ? AND approved = 0
        `;
    const [result] = await promisePool.execute(query, [workerId, workAreaId]);
    return result;
  } catch (error) {
    console.error("Error in approveJoinRequest:", error);
    throw error;
  }
};

// get all workArea join requests
const getJoinRequests = async () => {
  try {
    const query = `
            SELECT wwa.*, wa.name AS workArea_name, w.name AS worker_name
            FROM worker_workArea wwa
            JOIN workArea wa ON wwa.workArea_id = wa.id
            JOIN worker w ON wwa.worker_id = w.id
            WHERE wwa.is_active = 0
        `;
    const [rows] = await promisePool.execute(query);
    console.log("rows", rows);
    return rows;
  } catch (error) {
    console.error("Error in getJoinRequests:", error);
    throw error;
  }
};
// get workArea by company id
const getWorkAreasByCompanyId = async (companyId) => {
  try {
    const query = `
            SELECT * FROM workArea WHERE company_id = ?
        `;
    const [rows] = await promisePool.execute(query, [companyId]);
    return rows;
  } catch (error) {
    console.error("Error in getWorkAreasByCompanyId:", error);
    throw error;
  }
};
// delete workAreaRequest
const deleteRequest = async (workerId, workAreaId) => {
  try {
    const query = `
            DELETE FROM worker_workArea
            WHERE worker_id = ? AND workArea_id = ?
        `;
    const [result] = await promisePool.execute(query, [workerId, workAreaId]);
    return result;
  } catch (error) {
    console.error("Error in deleteRequest:", error);
    throw error;
  }
};
const findByAccessCode = async (access_code) => {
  try {
    const query = "SELECT * FROM workArea WHERE access_code = ?";
    const [rows] = await promisePool.execute(query, [access_code]);
    return rows[0]; // Assuming access code is unique, return the first result
  } catch (error) {
    console.error("Error in findByAccessCode:", error);
    throw error;
  }
};
const checkExistingJoinRequest = async (workerId, workAreaId) => {
  try {
    const query = `
      SELECT * FROM worker_workArea
      WHERE worker_id = ? AND workArea_id = ?
    `;
    const [rows] = await promisePool.execute(query, [workerId, workAreaId]);
    return rows.length > 0; // Returns true if there's any existing join request
  } catch (error) {
    console.error("Error in checkExistingJoinRequest:", error);
    throw error;
  }
};
const checkWorkerCompanyLink = async (workerId, companyId) => {
  try {
    const query = `
      SELECT * FROM worker_company
      WHERE worker_id = ? AND company_id = ?
    `;
    const [rows] = await promisePool.execute(query, [workerId, companyId]);
    return rows.length > 0; // Returns true if there's an existing link
  } catch (error) {
    console.error("Error in checkWorkerCompanyLink:", error);
    throw error;
  }
};
const createWorkerCompanyLink = async (workerId, companyId) => {
  try {
    const query = `
      INSERT INTO worker_company (worker_id, company_id)
      VALUES (?, ?)
    `;
    await promisePool.execute(query, [workerId, companyId]);
  } catch (error) {
    console.error("Error in createWorkerCompanyLink:", error);
    throw error;
  }
};
module.exports = {
  getWorkAreas,
  getWorkAreaById,
  getWorkAreasForUser,
  createWorkArea,
  requestJoinWorkArea,
  approveJoinRequest,
  getJoinRequests,
  getWorkAreasByCompanyId,
  deleteRequest,
  findByAccessCode,
  checkExistingJoinRequest,
  checkWorkerCompanyLink,
  createWorkerCompanyLink,
};
