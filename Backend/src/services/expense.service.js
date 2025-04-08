const { default: mongoose } = require("mongoose");
const Budget = require("../models/buget.model");
const Expense = require("../models/expense.model");
const { AppError } = require("../utils/errorHandler");

async function createExpense(userId, expenseData) {
  const { title, amount, category, date, note } = expenseData;

  const expenseDate = new Date(date);
  const month = expenseDate.getMonth() + 1;
  const year = expenseDate.getFullYear();

  const budget = await Budget.findOne({
    user: userId,
    category,
    month,
    year,
  });
  if (budget) {
    const totalSpent = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          category,
          date: {
            $gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`),
            $lte: new Date(`${year}-${month.toString().padStart(2, "0")}-31`),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const alreadySpent = totalSpent[0]?.total || 0;
    const newTotal = alreadySpent + amount;
    if (newTotal > budget.amount) {
      const exceededAmount = alreadySpent - budget.amount;
      budget.exceededAmount = exceededAmount;
      await budget.save();
    }
  }

  const expense = await Expense.create({
    title,
    amount,
    category,
    date,
    note,
    user: userId,
  });

  return expense;
}

async function getExpenses(userId) {
  const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
  return expenses;
}

async function getExpenseById(expenseId, userId) {
  const expense = await Expense.findOne({
    _id: expenseId,
    user: userId,
  });
  if (!expense) throw new AppError(404, "Expense not found");
  return expense;
}

async function updateExpense(expenseId, userId, updatedData) {
  const expense = await Expense.findOne({
    _id: expenseId,
    user: userId,
  });
  if (!expense) throw new AppError(404, "Expense not found");

  Object.assign(expense, updatedData);
  await expense.save();

  return expense;
}

async function deleteExpense(expenseId, userId) {
  const expense = await Expense.findOneAndDelete({
    _id: expenseId,
    user: userId,
  });
  if (!expense) throw new AppError(404, "Expense not found");
  return;
}

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
