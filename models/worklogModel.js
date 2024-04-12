"use strict";
const pool = require("../Db");
const promisePool = pool.promise();

// Get all worklogs from db

const getWorklogs = async () => {
  try {
    const [rows] = await promisePool.execute("SELECT * FROM work_log");
    return rows;
  } catch (e) {
    console.log("error", e.message);
    throw new Error("sql query failed", e);
  }
};

const getWorklogById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM work_log WHERE id = ?",
      [id]
    );
    return rows;
  } catch (e) {
    console.log("error", e.message);
    throw new Error("sql query failed", e);
  }
};

const getWorkLogByIdForWorkareaId = async (userId, workareaId) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM work_log WHERE id = ? AND workarea_id = ?",
      [userId, workareaId]
    );
    return rows;
  } catch (e) {
    console.log("error", e.message);
    throw new Error("sql query failed", e);
  }
};
const getCompanyIdByWorkAreaId = async (workArea_id) => {
  const sql = `SELECT company_id FROM workArea WHERE id = ?`;
  const [rows] = await promisePool.execute(sql, [workArea_id]);
  if (rows.length > 0) {
    return rows[0].company_id; // Assuming the query returns at least one row
  } else {
    throw new Error(
      "Work area not found or does not have an associated company."
    );
  }
};
const insertWorkLog = async (workLog) => {
  try {
    const sql = `INSERT INTO work_log (worker_id, company_id, workarea_id, start_time, end_time, hours_worked, date_recorded, work_type, comment, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [rows] = await promisePool.query(sql, [
      workLog.worker_id,
      workLog.company_id,
      workLog.workArea_id,
      workLog.start_time,
      workLog.end_time,
      workLog.hours_worked,
      workLog.date_recorded,
      workLog.work_type,
      workLog.comment,
      workLog.photo_url,
    ]);
    return rows;
  } catch (e) {
    console.log("error", e.message);
    throw new Error("sql query failed", e);
  }
};
// get all worklogs for companyId
const getWorklogsByCompanyId = async (companyId) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM work_log WHERE company_id = ?",
      [companyId]
    );
    return rows;
  } catch (e) {
    console.log("error", e.message);
    throw new Error("sql query failed", e);
  }
}

module.exports = {
  getWorklogs,
  getWorklogById,
  getWorkLogByIdForWorkareaId,
  getCompanyIdByWorkAreaId,
  insertWorkLog,
  getWorklogsByCompanyId,
};
