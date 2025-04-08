const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String },
    clientAddress: { type: String },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    items: [
      {
        itemName: String,
        quantity: Number,
        price: Number,
      },
    ],
    taxRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number },
    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Overdue"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
