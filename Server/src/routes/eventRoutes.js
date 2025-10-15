import express from "express";
import {
  createEvent,
  getApprovedEvents,
  getAllEvents,
  getPendingEvents, // ✅ import this
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
   📦 USER ROUTES
===========================
*/

// ✅ User creates a new event (default status: pending)
router.post("/", authMiddleware, upload.single("image"), createEvent);

// ✅ Get approved events (visible on /events page for normal users)
router.get("/", authMiddleware, getApprovedEvents);

// ✅ Get all events created by the logged-in user (dashboard)
router.get("/user", authMiddleware, getUserEvents);

/* 
===========================
   🛡️ ADMIN ROUTES
===========================
*/

// ✅ Get only pending events (for admin approval panel)
router.get("/pending", authMiddleware, getPendingEvents); // 🔥 Add this line

// ✅ Get all events (admin dashboard)
router.get("/admin", authMiddleware, getAllEvents);

// ✅ Approve or Decline event (admin only)
router.patch("/:id/status", authMiddleware, updateEventStatus);

/* 
===========================
   ⚙️ COMMON ROUTES
===========================
*/

// ✅ Update event details
router.put("/:id", authMiddleware, updateEvent);

// ✅ Delete event
router.delete("/:id", authMiddleware, deleteEvent);

// ✅ Get total count of all events
router.get("/count", authMiddleware, getEventCount);

export default router;
