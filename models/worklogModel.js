"use strict";
const pool = require("../Db");
const promisePool = pool.promise();

// Get all worklogs from db

const getWorklogs = async () => {
    try {
        const [rows] = await promisePool.execute(
            "SELECT * FROM work_log"
        );
        return rows;
    } catch (e) {
        console.log("error", e.message);
        throw new Error("sql query failed");
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
        throw new Error("sql query failed");
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
        throw new Error("sql query failed");
    }
};

module.exports = {
    getWorklogs,
    getWorklogById,
    getWorkLogByIdForWorkareaId,
};