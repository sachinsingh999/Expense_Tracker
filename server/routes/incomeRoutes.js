import express from "express";
import {
  addIncome,
  getIncome,
  deleteIncome,
} from "../controllers/incomeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All income routes are protected

router.route("/").get(getIncome).post(addIncome);
router.route("/:id").delete(deleteIncome);

export default router;
