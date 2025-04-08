const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: [
        "Food",
        "Transport",
        "Utilities",
        "Entertainment",
        "Shopping",
        "Other",
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    exceededAmount: { type: Number, default: 0 },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;
