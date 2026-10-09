const db = require("../config/db");

const getAllDesignations = async () => {

    const [rows] = await db.query(`
        SELECT *
        FROM designations
        WHERE status = 'active'
        ORDER BY name ASC
    `);

    return rows;
};

module.exports = {
    getAllDesignations
};