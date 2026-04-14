import express from "express";
import {
  createEvent,
  getEvents, // ✅ ADDED - main function jo admin check karega
  getApprovedEvents,
  getAllEvents,
  getPendingEvents,
  getUserEvents,
  updateEventStatus,
  updateEvent,
  deleteEvent,
  getEventCount,
} from "../controllers/eventController.js";
import { upload } from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* 
===========================
   USER ROUTES
===========================
*/

// Create new event (protected)
router.post("/", authMiddleware, upload.single("image"), createEvent);

// ✅ CHANGED: Get events - admin gets all, user gets approved only (service jaisa)
router.get("/", authMiddleware, getEvents);

// Get events created by logged-in user (protected)
router.get("/user", authMiddleware, getUserEvents);

/* 
===========================
   ADMIN ROUTES
===========================
*/

// Pending events (protected)
router.get("/pending", authMiddleware, getPendingEvents);

// ✅ CHANGED: Admin all events - same function (service jaisa)
router.get("/admin", authMiddleware, getEvents);

// Update event status (protected)
router.patch("/:id/status", authMiddleware, updateEventStatus);

/* 
===========================
   COMMON ROUTES
===========================
*/

// Update event (protected)
router.put("/:id", authMiddleware, updateEvent);

// Delete event (protected)
router.delete("/:id", authMiddleware, deleteEvent);

// ***** PUBLIC EVENT COUNT *****
router.get("/count", getEventCount);

export default router;
