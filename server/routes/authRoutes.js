import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateBudget,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/budget", protect, updateBudget);

export default router;
