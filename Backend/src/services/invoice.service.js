const Expense = require("../models/expense.model");
const Invoice = require("../models/invoice.model");
const { AppError } = require("../utils/errorHandler");

async function getDashboardData(userId) {
  const invoiceCount = await Invoice.countDocuments({ user: userId });

  const invoiceTotal = await Invoice.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  const expenseTotal = await Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const expenseChartData = await Expense.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: { $month: "$date" },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const monthlySummaryData = await Expense.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  return {
    invoiceCount,
    invoiceTotal: invoiceTotal[0]?.total || 0,
    expenseTotal: expenseTotal[0]?.total || 0,
    expenseChartData: {
      labels: expenseChartData.map((e) => `Month ${e._id}`),
      datasets: [
        {
          data: expenseChartData.map((e) => e.total),
          backgroundColor: "#4f86f7",
        },
      ],
    },
    monthlySummaryData: {
      labels: monthlySummaryData
        .map((d) => `${d._id.month}/${d._id.year}`)
        .reverse(),
      datasets: [
        {
          data: monthlySummaryData.map((d) => d.total).reverse(),
          backgroundColor: "#4f86f7",
        },
      ],
    },
  };
}

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
  getDashboardData,
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
