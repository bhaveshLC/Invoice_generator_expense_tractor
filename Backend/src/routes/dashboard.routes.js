const { getDashboardData } = require("../controllers/dashboard.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = require("express").Router();

router.get("/", asyncHandler(getDashboardData));

module.exports = { dashboardRoute: router };
