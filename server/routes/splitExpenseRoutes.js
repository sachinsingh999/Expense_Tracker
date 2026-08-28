import express from "express";
import {
  createSplitExpense,
  getSplitExpenses,
  getSplitExpenseById,
  updateSplitExpense,
  deleteSplitExpense,
  updateSettlementStatus,
  getSplitSummary,
} from "../controllers/splitExpenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createSplitExpense);
router.get("/", getSplitExpenses);
router.get("/summary", getSplitSummary);
router.get("/:id", getSplitExpenseById);
router.put("/:id", updateSplitExpense);
router.delete("/:id", deleteSplitExpense);
router.patch("/:id/settlements/:settlementId", updateSettlementStatus);

export default router;
