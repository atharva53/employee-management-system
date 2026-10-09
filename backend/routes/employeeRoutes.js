const express = require("express");

const {
    getEmployees,
    getEmployee,
    getNextEmployeeCode,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const router = express.Router();


// GET ALL
router.get("/", getEmployees);

// NEXT EMPLOYEE CODE
router.get("/next-code", getNextEmployeeCode);


// GET SINGLE
router.get("/:id", getEmployee);


// CREATE
router.post("/", createEmployee);

// UPDATE
router.put("/:id", updateEmployee);

// DELETE
router.delete("/:id", deleteEmployee);


module.exports = router;