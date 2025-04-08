const Invoice = require("../models/invoice.model");
const { AppError } = require("../utils/errorHandler");

async function createInvoice(userId, invoiceData) {
  invoiceData.user = userId;

  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const taxAmount = (subtotal * (invoiceData.taxRate || 0)) / 100;
  const discountAmount = invoiceData.discount || 0;
  invoiceData.total = subtotal + taxAmount - discountAmount;

  const invoice = await Invoice.create(invoiceData);
  return invoice;
}

async function getInvoices(userId) {
  const invoices = await Invoice.find({ user: userId }).sort({
    createdAt: -1,
  });
  return invoices;
}

async function getInvoiceById(invoiceId, userId) {
  const invoice = await Invoice.findOne({
    _id: invoiceId,
    user: userId,
  });
  if (!invoice) {
    throw new AppError(404, "Invoice not found");
  }
  return invoice;
}

async function updateInvoice(invoiceId, userId, updatedData) {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: invoiceId, user: userId },
    updatedData,
    { new: true, runValidators: true }
  );
  if (!invoice) {
    throw new AppError(404, "Invoice not found");
  }
  return invoice;
}

async function deleteInvoice(invoiceId, userId) {
  const invoice = await Invoice.findOneAndDelete({
    _id: invoiceId,
    user: userId,
  });
  if (!invoice) {
    throw new AppError(404, "Invoice not found");
  }
  return;
}

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
