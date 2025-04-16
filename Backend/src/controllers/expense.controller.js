const expenseService = require("../services/expense.service");
const addExpense = async (req, res) => {
  const expense = await expenseService.createExpense(req.userId, req.body);
  res.status(201).json({
    status: "success",
    data: {
      expense,
    },
  });
};
const getExpenses = async (req, res) => {
  const expenses = await expenseService.getExpenses(req.userId, req.query);
  res.status(200).json({
    status: "success",
    data: expenses,
  });
};
const getExpenseById = async (req, res) => {
  const expense = await expenseService.getExpenseById(
    req.params.expenseId,
    req.userId
  );
  res.status(200).json({
    status: "success",
    data: {
      expense,
    },
  });
};
const updateExpense = async (req, res) => {
  const expense = await expenseService.updateExpense(
    req.params.expenseId,
    req.userId,
    req.body
  );
  res.status(200).json({
    status: "success",
    data: {
      expense,
    },
  });
};
const deleteExpense = async (req, res) => {
  await expenseService.deleteExpense(req.params.expenseId, req.userId);
  res.status(204).json({
    status: "success",
    data: null,
  });
};
module.exports = {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
