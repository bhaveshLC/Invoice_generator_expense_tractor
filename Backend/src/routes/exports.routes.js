const {
  exportExpensesToExcel,
  exportInvoicesToExcel,
} = require("../controllers/export.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = require("express").Router();

router
  .get("/expense", asyncHandler(exportExpensesToExcel))
  .get("/invoice", asyncHandler(exportInvoicesToExcel));

module.exports = { exportRotue: router };
