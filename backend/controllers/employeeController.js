const employeeModel = require("../models/employeeModel");


// GET ALL EMPLOYEES

const getEmployees = async (req, res) => {

    try {

        const employees =
            await employeeModel.getAllEmployees();

        res.json({
            success: true,
            data: employees
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch employees"
        });

    }
};


// GET SINGLE EMPLOYEE

const getEmployee = async (req, res) => {

    try {

        const { id } = req.params;

        const employee =
            await employeeModel.getEmployeeById(id);

        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        res.json({
            success: true,
            data: employee
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch employee"
        });

    }
};


const getNextEmployeeCode = async (req, res) => {

    try {
        const employeeCode =
            await employeeModel.getNextEmployeeCode();

        res.json({
            success: true,
            data: {
                employee_code: employeeCode
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to generate employee code"
        });
    }
};


// CREATE EMPLOYEE

const createEmployee = async (req, res) => {

    try {

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
        } = req.body;


        if (
            !first_name ||
            !email ||
            !joining_date
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "First name, email and joining date are required"
            });

        }


        const result =
            await employeeModel.createEmployee(req.body);


        res.status(201).json({

            success: true,

            message: "Employee created successfully",

            employeeId: result.insertId,
            employeeCode: result.employeeCode

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create employee"
        });

    }
};



const updateEmployee = async (req, res) => {

    try {

        const { id } = req.params;

        const result =
            await employeeModel.updateEmployee(
                id,
                req.body
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,
                message: "Employee not found"

            });

        }


        res.json({

            success: true,
            message: "Employee updated successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Failed to update employee"

        });

    }

};

const deleteEmployee = async (req, res) => {

    try {

        const { id } = req.params;

        const result =
            await employeeModel.deleteEmployee(id);


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,
                message: "Employee not found"

            });

        }


        res.json({

            success: true,
            message: "Employee deleted successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Failed to delete employee"

        });

    }

};


module.exports = {
    getEmployees,
    getEmployee,
    getNextEmployeeCode,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
