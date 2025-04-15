const router = require("express").Router();
const {
  createBudget,
  getBudgets,
  getBudgetByCategory,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
} = require("../controllers/budget.controller");
const asyncHandler = require("../middleware/asyncHandler");

router
  .post("/", asyncHandler(createBudget))
  .get("/", asyncHandler(getBudgets))
  .get("/summary", asyncHandler(getBudgetSummary))
  .get("/:category/:month/:year", asyncHandler(getBudgetByCategory))
  .put("/:id", asyncHandler(updateBudget))
  .delete("/:id", asyncHandler(deleteBudget));

module.exports = { budgetRoute: router };
