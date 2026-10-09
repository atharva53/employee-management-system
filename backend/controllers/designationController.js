const designationModel =
    require("../models/designationModel");


const getDesignations = async (req, res) => {

    try {

        const designations =
            await designationModel.getAllDesignations();

        res.json({

            success: true,
            data: designations

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Failed to fetch designations"

        });

    }

};


module.exports = {
    getDesignations
};