const express = require("express");

const {
    getDesignations
} = require("../controllers/designationController");

const router = express.Router();

router.get("/", getDesignations);

module.exports = router;