const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/DB_connection");
const { globalErrorHandler } = require("./utils/errorHandler");
const { authRoute } = require("./routes/auth.routes");
const { userRoute } = require("./routes/user.routes");
const authMiddleware = require("./middleware/auth.middleware");
const { invoiceRotue } = require("./routes/invoice.routes");
const { expenseRoute } = require("./routes/expense.routes");
const { budgetRoute } = require("./routes/budget.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.use("/api/users", authMiddleware, userRoute);
app.use("/api/invoices", authMiddleware, invoiceRotue);
app.use("/api/expense", authMiddleware, expenseRoute);
app.use("/api/budget", authMiddleware, budgetRoute);
app.use(globalErrorHandler);

module.exports = app;

// Report / Dashboard APIs
// GET	/api/dashboard/summary	Get total income, expenses, and balance
// GET	/api/dashboard/charts	Get data for charts (monthly income vs expenses, category breakdown)

// PDF & Email (Optional but Useful)
// GET	/api/invoices/:id/download	Generate and download invoice as PDF
// POST	/api/invoices/:id/send	Email invoice to the client
