const router = require("express").Router();

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice,
  updateInvoice,
} = require("../controllers/invoice.controller");
const asyncHandler = require("../middleware/asyncHandler");

router
  .post("/", asyncHandler(createInvoice))
  .get("/", asyncHandler(getInvoices))
  .get("/:invoiceId", asyncHandler(getInvoiceById))
  .put("/:invoiceId", asyncHandler(updateInvoice))
  .delete("/:invoiceId", asyncHandler(deleteInvoice));

module.exports = { invoiceRotue: router };
