const Expense = require("../models/expense.model");
const Invoice = require("../models/invoice.model");
const User = require("../models/user.model");
const sendEmail = require("../utils/emailHandler");
const { AppError } = require("../utils/errorHandler");
const PDFService = require("./pdf.service");

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

async function getInvoices(userId, query) {
  if (!query.page) {
    const invoices = await Invoice.find({ user: userId }).sort({
      createdAt: -1,
    });
    return invoices;
  }
  const page = Number(query.page);
  const limit = 10;
  const totalCount = await Invoice.countDocuments({ user: userId });
  const invoices = await Invoice.find({ user: userId })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({
      createdAt: -1,
    });
  return {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    invoices,
  };
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
  console.log(updatedData);
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
async function markAsPaid(invoiceId, userId) {
  const invoice = await Invoice.findOne({ _id: invoiceId, user: userId });
  if (!invoice) {
    throw new AppError(404, "Invoice not found");
  }
  invoice.status = "Paid";
  await invoice.save();
  return invoice;
}

async function sendInvoice(invoiceId, userId) {
  const invoice = await Invoice.findOne({
    _id: invoiceId,
    user: userId,
  }).populate("user", "name");
  if (!invoice) {
    throw new AppError(404, "Invoice not found");
  }
  const user = await User.findById(userId);
  const pdfBuffer = await PDFService.generateInvoicePDF(invoice, user);
  if (!pdfBuffer) {
    throw new AppError(400, "PDF is not generated...");
  }
  console.log("PDF Buffer length:", pdfBuffer?.length);

  const emailBody = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #2a3158;">Hi ${invoice.clientName},</h2>
    <p>Thank you for your business. Please find your invoice attached below.</p>
    
    <table style="margin-top: 20px; border-collapse: collapse; width: 100%;">
      <tr>
        <td><strong>Invoice Date:</strong></td>
        <td>${new Date(invoice.invoiceDate).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td><strong>Due Date:</strong></td>
        <td>${
          invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString()
            : "N/A"
        }</td>
      </tr>
      <tr>
        <td><strong>Status:</strong></td>
        <td style="color: ${
          invoice.status === "Paid" ? "green" : "red"
        };"><strong>${invoice.status}</strong></td>
      </tr>
      <tr>
        <td><strong>Total:</strong></td>
        <td>₹${invoice.total.toFixed(2)}</td>
      </tr>
    </table>

    <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email.</p>

    <p style="margin-top: 20px;">Best regards,<br/>Your Company Name</p>
  </div>
`;
  await sendEmail({
    to: invoice.clientEmail,
    subject: `Your Invoice from ${invoice.user.name}`,
    text: `Hi ${invoice.clientName},\n\nPlease find your invoice attached.`,
    html: emailBody,
    attachments: [
      {
        filename: `Invoice_${invoice._id}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
  return;
}

async function sendInvoiceReminder() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const invoices = await Invoice.find({
    invoiceDate: {
      $gte: today,
      $lt: tomorrow,
    },
    status: { $ne: "Paid" },
  }).populate("user", "name email");
  console.log(invoices);
  for (const invoice of invoices) {
    const emailBody = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #2a3158;">Hello ${invoice.clientName},</h2>
        <p>This is a reminder that your invoice is due today.</p>
        <p><strong>Total Due:</strong> ₹${invoice.total.toFixed(2)}</p>
        <br/>
        <p>Best regards,<br/>${invoice.user.name}</p>
      </div>
    `;

    await sendEmail({
      to: invoice.clientEmail,
      subject: `Invoice Reminder from ${invoice.user.name}`,
      text: `Hi ${
        invoice.clientName
      },\n\nJust a reminder that your invoice is due today.\n\nTotal: $${invoice.total.toFixed(
        2
      )}.`,
      html: emailBody,
    });
  }

  console.log(`${invoices.length} reminders sent.`);
}
module.exports = {
  getDashboardData,
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  markAsPaid,
  sendInvoice,
  sendInvoiceReminder,
};
