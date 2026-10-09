const departmentModel =
    require("../models/departmentModel");


const getDepartments = async (req, res) => {

    try {

        const departments =
            await departmentModel.getAllDepartments();

        res.json({

            success: true,
            data: departments

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Failed to fetch departments"

        });

    }

};


module.exports = {
    getDepartments
};