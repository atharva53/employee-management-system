const db = require("../config/db");

const getAllEmployees = async () => {

    const [rows] = await db.query(`
        SELECT
            e.id,
            e.employee_code,
            e.first_name,
            e.last_name,
            e.email,
            e.phone,
            e.gender,
            e.date_of_birth,
            e.joining_date,
            e.salary,
            e.address,
            e.city,
            e.state,
            e.pincode,
            e.status,

            d.name AS department_name,
            des.name AS designation_name

        FROM employees e

        LEFT JOIN departments d
            ON e.department_id = d.id

        LEFT JOIN designations des
            ON e.designation_id = des.id

        ORDER BY e.id DESC
    `);

    return rows;
};


const getEmployeeById = async (id) => {

    const [rows] = await db.query(`
        SELECT
            e.*,
            d.name AS department_name,
            des.name AS designation_name

        FROM employees e

        LEFT JOIN departments d
            ON e.department_id = d.id

        LEFT JOIN designations des
            ON e.designation_id = des.id

        WHERE e.id = ?
    `, [id]);

    return rows[0];
};


const getNextEmployeeCode = async (connection = db) => {
    const [rows] = await connection.query(`
        SELECT MAX(CAST(SUBSTRING(employee_code, 4) AS UNSIGNED)) AS last_number
        FROM employees
        WHERE employee_code REGEXP '^EMP[0-9]+$'
    `);

    const nextNumber = Number(rows[0].last_number || 0) + 1;

    return `EMP${String(nextNumber).padStart(3, "0")}`;
};


const createEmployee = async (employee) => {

    const {
        first_name,
        last_name,
        email,
        phone,
        gender,
        date_of_birth,
        department_id,
        designation_id,
        joining_date,
        salary,
        address,
        city,
        state,
        pincode
    } = employee;

    const connection = await db.getConnection();
    let lockAcquired = false;

    try {
        const [lockRows] = await connection.query(
            "SELECT GET_LOCK(?, 10) AS acquired",
            ["employee-management:employee-code"]
        );

        if (Number(lockRows[0].acquired) !== 1) {
            throw new Error("Could not acquire employee code lock");
        }

        lockAcquired = true;
        const employeeCode = await getNextEmployeeCode(connection);

        const [result] = await connection.query(`
            INSERT INTO employees (
                employee_code,
                first_name,
                last_name,
                email,
                phone,
                gender,
                date_of_birth,
                department_id,
                designation_id,
                joining_date,
                salary,
                address,
                city,
                state,
                pincode
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            employeeCode,
            first_name,
            last_name,
            email,
            phone,
            gender,
            date_of_birth,
            department_id,
            designation_id,
            joining_date,
            salary,
            address,
            city,
            state,
            pincode
        ]);

        return { ...result, employeeCode };
    } finally {
        try {
            if (lockAcquired) {
                await connection.query(
                    "SELECT RELEASE_LOCK(?)",
                    ["employee-management:employee-code"]
                );
            }
        } finally {
            connection.release();
        }
    }
};

const updateEmployee = async (id, employee) => {

    const {
        employee_code,
        first_name,
        last_name,
        email,
        phone,
        gender,
        date_of_birth,
        department_id,
        designation_id,
        joining_date,
        salary,
        address,
        city,
        state,
        pincode,
        status
    } = employee;


    const [result] = await db.query(`

        UPDATE employees

        SET
            employee_code = ?,
            first_name = ?,
            last_name = ?,
            email = ?,
            phone = ?,
            gender = ?,
            date_of_birth = ?,
            department_id = ?,
            designation_id = ?,
            joining_date = ?,
            salary = ?,
            address = ?,
            city = ?,
            state = ?,
            pincode = ?,
            status = ?

        WHERE id = ?

    `, [

        employee_code,
        first_name,
        last_name,
        email,
        phone,
        gender,
        date_of_birth,
        department_id,
        designation_id,
        joining_date,
        salary,
        address,
        city,
        state,
        pincode,
        status,
        id

    ]);


    return result;
};

const deleteEmployee = async (id) => {

    const [result] = await db.query(
        "DELETE FROM employees WHERE id = ?",
        [id]
    );

    return result;
};


module.exports = {
    getAllEmployees,
    getEmployeeById,
    getNextEmployeeCode,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
    
