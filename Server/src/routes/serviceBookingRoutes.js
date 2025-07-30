import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createServiceBooking,
  getUserServiceBookings,
  cancelServiceBooking,
} from "../controllers/serviceBookingController.js";

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (RSVP)
 */
router.post("/", authMiddleware, createServiceBooking);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings for the logged-in user
 */
router.get("/", authMiddleware, getUserServiceBookings);

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking
 */
router.delete("/:id", authMiddleware, cancelServiceBooking);

export default router;
