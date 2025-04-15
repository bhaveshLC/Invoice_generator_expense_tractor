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
const { dashboardRoute } = require("./routes/dashboard.routes");
const { exportRotue } = require("./routes/exports.routes");
require("./corn/invoiceReminder.cron");
const app = express();

connectDB();

app.use(
  cors({
    exposedHeaders: ["Content-Disposition"],
  })
);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.use("/api/dashboard", authMiddleware, dashboardRoute);
app.use("/api/users", authMiddleware, userRoute);
app.use("/api/invoices", authMiddleware, invoiceRotue);
app.use("/api/expense", authMiddleware, expenseRoute);
app.use("/api/budget", authMiddleware, budgetRoute);
app.use("/api/export", authMiddleware, exportRotue);
app.use(globalErrorHandler);

module.exports = app;
