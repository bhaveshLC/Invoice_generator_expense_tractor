const router = require("express").Router();

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice,
  updateInvoice,
  getDashboardData,
  getInvoicePDF,
  markAsPaid,
  sendInvoiceMail,
} = require("../controllers/invoice.controller");
const asyncHandler = require("../middleware/asyncHandler");

router
  .get("/dashboard", asyncHandler(getDashboardData))
  .get("/pdf/:id", asyncHandler(getInvoicePDF))
  .get("/send-mail/:id", asyncHandler(sendInvoiceMail))
  .post("/", asyncHandler(createInvoice))
  .get("/", asyncHandler(getInvoices))
  .get("/:invoiceId", asyncHandler(getInvoiceById))
  .put("/paid/:invoiceId", asyncHandler(markAsPaid))
  .put("/:invoiceId", asyncHandler(updateInvoice))
  .delete("/:invoiceId", asyncHandler(deleteInvoice));

module.exports = { invoiceRotue: router };
