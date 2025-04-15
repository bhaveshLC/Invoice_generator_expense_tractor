const { default: mongoose } = require("mongoose");
const Budget = require("../models/buget.model");
const Expense = require("../models/expense.model");
const { AppError } = require("../utils/errorHandler");

async function createBudget(userId, BudgetData) {
  const { category, amount, month, year } = BudgetData;
  const existingBudget = await Budget.findOne({
    category,
    month,
    year,
  });
  if (existingBudget) {
    throw new AppError(409, "Budget Already Available");
  }
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
async function getBudgetSummary(userId, queryData) {
  const budgets = await Budget.find({
    user: userId,
  });

  const expenses = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$category",
        spentAmount: { $sum: "$amount" },
      },
    },
  ]);
  console.log(expenses);
  const spentMap = {};
  expenses.forEach((e) => {
    spentMap[e._id] = e.spentAmount;
  });
  console.log(spentMap);
  const summary = budgets.map((b) => {
    const spent = spentMap[b.category] || 0;
    const percentage = Math.min(((spent / b.amount) * 100).toFixed(2), 100);

    return {
      category: b.category,
      budgetAmount: b.amount,
      spentAmount: spent,
      remainingAmount: b.amount - spent,
      percentageSpent: Number(percentage),
    };
  });

  return summary;
}
module.exports = {
  createBudget,
  getBudgets,
  getBudgetByCategory,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
};
