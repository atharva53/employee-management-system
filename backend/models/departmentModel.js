const db = require("../config/db");

const getAllDepartments = async () => {

    const [rows] = await db.query(`
        SELECT *
        FROM departments
        WHERE status = 'active'
        ORDER BY name ASC
    `);

    return rows;
};

module.exports = {
    getAllDepartments
};