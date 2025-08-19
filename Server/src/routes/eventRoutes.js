import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventCount,
} from "../controllers/eventController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Upload middleware ab valid hai
router.post("/", upload.single("image"), createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.delete("/event-count", getEventCount);

export default router;
