const Invoice = require("../models/invoice.model");
const invoiceService = require("../services/invoice.service");
const PDFService = require("../services/pdf.service");
const { AppError } = require("../utils/errorHandler");
const getDashboardData = async (req, res) => {
  const data = await invoiceService.getDashboardData(req.userId);
  res.status(200).json({
    status: "success",
    data,
  });
};
const createInvoice = async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.userId, req.body);
  res.status(201).json({
    status: "success",
    data: {
      invoice,
    },
  });
};

const getInvoices = async (req, res) => {
  const invoices = await invoiceService.getInvoices(req.userId, req.query);
  res.status(200).json({
    status: "success",
    data: invoices,
  });
};
const getInvoiceById = async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(
    req.params.invoiceId,
    req.userId
  );
  res.status(200).json({
    status: "success",
    data: {
      invoice,
    },
  });
};
const updateInvoice = async (req, res) => {
  const invoice = await invoiceService.updateInvoice(
    req.params.invoiceId,
    req.userId,
    req.body
  );
  res.status(200).json({
    status: "success",
    data: {
      invoice,
    },
  });
};
const deleteInvoice = async (req, res) => {
  await invoiceService.deleteInvoice(req.params.invoiceId, req.userId);
  res.status(204).json({
    status: "success",
    data: null,
  });
};
const markAsPaid = async (req, res) => {
  const invoice = await invoiceService.markAsPaid(
    req.params.invoiceId,
    req.userId
  );
  res.status(200).json({
    status: "success",
    data: {
      invoice,
    },
  });
};

async function getInvoicePDF(req, res) {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!invoice) {
      throw new AppError(404, "Invoice not found");
    }
    const pdfBuffer = await PDFService.generateInvoicePDF(invoice);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${invoice._id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error generating PDF",
    });
  }
}
const sendInvoiceMail = async (req, res) => {
  const invoice = await invoiceService.sendInvoice(req.params.id, req.userId);
  res.status(200).json();
};
module.exports = {
  getDashboardData,
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoicePDF,
  markAsPaid,
  sendInvoiceMail,
};
