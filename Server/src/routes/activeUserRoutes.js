import express from "express";
import { getActiveUsers } from "../controllers/activeUserController.js";

const router = express.Router();

router.get("/active-users", getActiveUsers);

export default router;
