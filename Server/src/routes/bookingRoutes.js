import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createBooking,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (RSVP)
 */
router.post("/", authMiddleware, createBooking);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings for the logged-in user
 */
router.get("/", authMiddleware, getUserBookings);

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking
 */
router.delete("/:id", authMiddleware, cancelBooking);

export default router;
