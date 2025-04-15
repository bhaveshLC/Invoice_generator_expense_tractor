const dashboardService = require("../services/dashboard.service");

const getDashboardData = async (req, res) => {
  const dashboardData = await dashboardService.getDashboardData(req.userId);
  res.status(200).json({
    status: "success",
    dashboardData,
  });
};
module.exports = { getDashboardData };
