// routes/dailyDigestRoutes.ts
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateDailyDigest } from "../controllers/dailyDigestController.js";

const router = express.Router();

/**
 * @route   GET /api/daily-digest
 * @desc    Get the daily digest for the logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, generateDailyDigest);

export default router;
