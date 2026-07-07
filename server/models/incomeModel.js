import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
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
    source: {
      type: String,
      enum: [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Gift",
        "Rental",
        "Other",
      ],
      default: "Other",
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
  },
  {
    timestamps: true,
  }
);

const Income = mongoose.model("Income", incomeSchema);
export default Income;
