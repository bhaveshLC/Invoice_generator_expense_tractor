const Expense = require("../models/expense.model");
const excel = require("exceljs");
const Invoice = require("../models/invoice.model");

const exportExpensesToExcel = async (req, res) => {
  const expenses = await Expense.find({ user: req.userId }).populate(
    "user",
    "name"
  );

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("Expenses");

  worksheet.columns = [
    { header: "Title", key: "title", width: 30 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Category", key: "category", width: 20 },
    { header: "Date", key: "date", width: 20 },
    { header: "Note", key: "note", width: 30 },
  ];

  expenses.forEach((expense) => {
    worksheet.addRow({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toLocaleDateString(),
      note: expense.note,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=expenses.xlsx");

  await workbook.xlsx.write(res);
  res.end();
};
const exportInvoicesToExcel = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.userId }).populate("user");

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Invoices");

    worksheet.columns = [
      { header: "Client Name", key: "clientName", width: 30 },
      { header: "Client Email", key: "clientEmail", width: 30 },
      { header: "Invoice Date", key: "invoiceDate", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Item Name", key: "itemName", width: 30 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Price", key: "price", width: 15 },
      { header: "Total", key: "itemTotal", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];
    invoices.forEach((invoice) => {
      const itemNames = invoice.items.map((i) => i.itemName).join("\n");
      const quantities = invoice.items.map((i) => i.quantity).join("\n");
      const prices = invoice.items.map((i) => i.price).join("\n");
      const row = worksheet.addRow({
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        invoiceDate: invoice.invoiceDate.toLocaleDateString(),
        dueDate: invoice.dueDate ? invoice.dueDate.toLocaleDateString() : "",
        itemName: itemNames,
        quantity: quantities,
        price: prices,
        itemTotal: invoice.total,
        status: invoice.status,
      });

      row.eachCell((cell) => {
        cell.alignment = { wrapText: true, vertical: "top" };
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=invoices.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error exporting invoices" });
  }
};

module.exports = { exportExpensesToExcel, exportInvoicesToExcel };
