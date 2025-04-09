const invoiceService = require("../services/invoice.service");
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
  const invoices = await invoiceService.getInvoices(req.userId);
  res.status(200).json({
    status: "success",
    data: {
      invoices,
    },
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
module.exports = {
  getDashboardData,
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
