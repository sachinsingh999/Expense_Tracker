import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseAnalytics,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All expense routes are protected

router.route("/").get(getExpenses).post(addExpense);
router.route("/analytics").get(getExpenseAnalytics);
router.route("/:id").put(updateExpense).delete(deleteExpense);

export default router;
