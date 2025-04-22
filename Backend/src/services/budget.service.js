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
async function getBudgets(userId, queryData) {
  const month = queryData.month || "4";
  const year = queryData.year || "2025";
  const budgets = await Budget.find({
    user: userId,
    month: month,
    year,
  });
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
  const month = queryData.month;
  const year = queryData.year;

  const budgets = await Budget.find({
    user: userId,
    month,
    year,
  });
  const monthInt = parseInt(month) - 1;
  const start = new Date(year, monthInt, 1);
  const end = new Date(year, monthInt + 1, 1);
  if (budgets.length != 0) {
    const expenses = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          spentAmount: { $sum: "$amount" },
        },
      },
    ]);
    const spentMap = {};
    expenses.forEach((e) => {
      spentMap[e._id] = e.spentAmount;
    });
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
  return [];
}
module.exports = {
  createBudget,
  getBudgets,
  getBudgetByCategory,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
};
