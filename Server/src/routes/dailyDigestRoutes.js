// routes/dailyDigestRoutes.ts
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateDailyDigest } from "../controllers/dailyDigestController.js";

const router = express.Router();

// Protected route: only logged-in users
router.get("/", authMiddleware, generateDailyDigest);

export default router;
