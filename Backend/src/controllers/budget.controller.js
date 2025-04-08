const budgetService = require("../services/budget.service");

const createBudget = async (req, res) => {
  const bugetData = req.body;
  const userId = req.userId;
  const budget = await budgetService.createBudget(userId, bugetData);
  res.status(201).json({
    status: "success",
    data: {
      budget,
    },
  });
};
const getBudgets = async (req, res) => {
  const userId = req.userId;
  const budgets = await budgetService.getBudgets(userId);
  res.status(200).json({
    status: "success",
    data: {
      budgets,
    },
  });
};
const getBudgetByCategory = async (req, res) => {
  const paramsData = req.params;
  const userId = req.userId;
  const budget = await budgetService.getBudgetByCategory(paramsData, userId);
  res.status(200).json({
    status: "success",
    data: {
      budget,
    },
  });
};
const updateBudget = async (req, res) => {
  const budgetId = req.params.id;
  const userId = req.userId;
  const updatedData = req.body;
  const budget = await budgetService.updateBudget(
    budgetId,
    userId,
    updatedData
  );
  res.status(200).json({
    status: "success",
    data: {
      budget,
    },
  });
};
const deleteBudget = async (req, res) => {
  const budgetId = req.params.id;
  const userId = req.userId;
  await budgetService.deleteBudget(budgetId, userId);
  res.status(204).json({
    status: "success",
    data: null,
  });
};
module.exports = {
  createBudget,
  getBudgets,
  getBudgetByCategory,
  updateBudget,
  deleteBudget,
};
