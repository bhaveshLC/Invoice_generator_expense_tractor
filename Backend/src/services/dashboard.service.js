const mongoose = require("mongoose");
const Invoice = require("../models/invoice.model");
const Expense = require("../models/expense.model");

async function getDashboardData(userId) {
  try {
    const expenseAgg = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const invoiceAgg = await Invoice.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const invoiceCount = await Invoice.countDocuments({ user: userId });

    const paidAgg = await Invoice.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const unpaidAgg = await Invoice.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId), status: "Unpaid" },
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const recentInvoices = await Invoice.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("clientName total status");
    const recentExpenses = await Expense.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category amount");

    const categoryExpenseData = await await Expense.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthlyInvoiceData = await Invoice.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $month: "$invoiceDate" },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const categoryLabels = [
      "Food",
      "Transport",
      "Utilities",
      "Entertainment",
      "Shopping",
      "Other",
    ];
    const totalsMap = Object.fromEntries(
      categoryExpenseData.map((e) => [e._id, e.total])
    );
    const expenseChartData = {
      labels: categoryLabels,
      data: categoryLabels.map((label) => totalsMap[label] || 0),
    };
    const fullMonthData = Array(12).fill(0);
    monthlyInvoiceData.forEach((entry) => {
      const monthIndex = entry._id - 1;
      fullMonthData[monthIndex] = entry.total;
    });

    const monthlySummaryData = {
      labels: monthLabels,
      datasets: fullMonthData,
    };
    return {
      status: "success",
      data: {
        invoiceCount,
        invoiceTotal: invoiceAgg[0]?.total || 0,
        expenseTotal: expenseAgg[0]?.total || 0,
        paidAmount: paidAgg[0]?.total || 0,
        unpaidAmount: unpaidAgg[0]?.total || 0,
        recentInvoices,
        recentExpenses,
        expenseChartData,
        monthlySummaryData,
      },
    };
  } catch (err) {
    console.error("Error in getDashboardData:", err);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
}

module.exports = { getDashboardData };
