const router = require("express").Router();
const {
  getExpenses,
  getExpenseById,
  deleteExpense,
  updateExpense,
  addExpense,
} = require("../controllers/expense.controller");
const asyncHandler = require("../middleware/asyncHandler");

router
  .post("/", asyncHandler(addExpense))
  .get("/", asyncHandler(getExpenses))
  .get("/:expenseId", asyncHandler(getExpenseById))
  .put("/:expenseId", asyncHandler(updateExpense))
  .delete("/:expenseId", asyncHandler(deleteExpense));

module.exports = { expenseRoute: router };
