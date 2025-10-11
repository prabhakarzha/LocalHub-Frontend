import express from "express";
import { getUserCount } from "../controllers/userController.js"; // or wherever you defined it

const router = express.Router();

router.get("/count", getUserCount);

export default router;
