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

async function getExpenses(userId, params) {
  const query = { user: userId };
  const limit = 10;

  // Safe defaults
  let category,
    minPrice,
    monthYear,
    page = 1;

  // Parse filter only if it exists
  if (params?.filter) {
    try {
      const filter = JSON.parse(params.filter);
      ({ category, minPrice, monthYear, page = 1 } = filter);
    } catch (err) {
      console.error("Failed to parse filter:", err);
    }
  }

  // Ensure page is a number
  page = Number(page);

  // Build query
  if (category) query.category = category;
  if (minPrice) query.amount = { $gte: Number(minPrice) };
  if (monthYear) {
    const [year, month] = monthYear.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    query.date = { $gte: startDate, $lt: endDate };
  }

  const totalCount = await Expense.countDocuments(query);
  const expenses = await Expense.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ date: -1 });

  return {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    expenses,
  };
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
