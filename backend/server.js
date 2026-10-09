const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const db = require("./config/db");
const employeeRoutes =
    require("./routes/employeeRoutes");

const departmentRoutes =
    require("./routes/departmentRoutes");

const designationRoutes =
    require("./routes/designationRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/employees", 
    employeeRoutes
);
app.use(
    "/api/departments",
    departmentRoutes
);

app.use(
    "/api/designations",
    designationRoutes
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Employee Management API is running"
    });
});

app.get("/api/test-db", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT 1 + 1 AS result"
        );

        res.json({
            success: true,
            result: rows[0].result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});