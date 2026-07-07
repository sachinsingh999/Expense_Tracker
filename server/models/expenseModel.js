import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Entertainment",
        "Health",
        "Education",
        "Travel",
        "Other",
      ],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Card", "UPI", "NetBanking", "Other"],
      default: "Cash",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringInterval: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", ""],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
