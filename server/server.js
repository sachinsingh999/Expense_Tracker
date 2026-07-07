import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost origin during development
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running ✅" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/goals", goalRoutes);

// Start server first
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// DB Connection
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("⚠️  Please check your MongoDB Atlas credentials and IP whitelist");
  });