"use strict";
const pool = require("../Db");
const promisePool = pool.promise();

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
            WHERE wwa.worker_id = ? AND wwa.is_active = 1
        `;
    const [rows] = await promisePool.execute(query, [userId]);
    return rows;
  } catch (error) {
    console.error("Error in getWorkAreasForUser:", error);
    throw error;
  }
};

const createWorkArea = async (workAreaDetails) => {
  try {
    const query = `
            INSERT INTO workArea (company_id, name, description, latitude, longitude, radius, access_code)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const {
      company_id,
      name,
      description,
      latitude,
      longitude,
      radius,
      access_code,
    } = workAreaDetails;
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
const reguestJoinWorkArea = async (workerId, access_code) => {
  try {
    const query = `
            INSERT INTO worker_workArea (worker_id, workArea_id, is_active)
            VALUES (?, (SELECT id FROM workArea WHERE access_code = ?), 0)
        `;
    const [result] = await promisePool.execute(query, [workerId, access_code]);
    return result;
  } catch (error) {
    console.error("Error in reguestJoinWorkArea:", error);
    throw error;
  }
};
const approveJoinRequest = async (workerId, workAreaId) => {
  try {
    const query = `
            UPDATE worker_workArea
            SET is_active = TRUE
            WHERE worker_id = ? AND workArea_id = ? AND is_active = 0
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
module.exports = {
  getWorkAreas,
  getWorkAreaById,
  getWorkAreasForUser,
  createWorkArea,
  reguestJoinWorkArea,
  approveJoinRequest,
  getJoinRequests,
  getWorkAreasByCompanyId,
  deleteRequest,
};
