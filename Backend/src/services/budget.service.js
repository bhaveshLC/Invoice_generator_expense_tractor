const Budget = require("../models/buget.model");
const { AppError } = require("../utils/errorHandler");

async function createBudget(userId, BudgetData) {
  const { category, amount, month, year } = BudgetData;
  const budget = await Budget.create({
    user: userId,
    category,
    amount,
    month,
    year,
  });
  return budget;
}
async function getBudgets(userId) {
  const budgets = await Budget.find({ user: userId });
  return budgets;
}
async function getBudgetByCategory(paramsData) {
  const { category, month, year } = paramsData;

  const budget = await Budget.findOne({
    user: req.user.id,
    category,
    month,
    year,
  });

  if (!budget) throw new AppError(404, "Budget not found");

  return budget;
}
async function updateBudget(budgetId, userId, updatedData) {
  const budget = await Budget.findOne({
    _id: budgetId,
    user: userId,
  });

  if (!budget) throw new AppError(404, "Budget not found");

  Object.assign(budget, updatedData);
  await budget.save();

  return budget;
}
async function deleteBudget(budgetId, userId) {
  const budget = await Budget.findOneAndDelete({
    _id: budgetId,
    user: userId,
  });
  if (!budget) throw new AppError(404, "Budget not found");
  return;
}
module.exports = {
  createBudget,
  getBudgets,
  getBudgetByCategory,
  updateBudget,
  deleteBudget,
};
