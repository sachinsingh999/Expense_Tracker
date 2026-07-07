import express from "express";
import {
  createGoal,
  getGoals,
  contributeToGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getGoals).post(createGoal);
router.route("/:id").put(updateGoal).delete(deleteGoal);
router.route("/:id/contribute").put(contributeToGoal);

export default router;
