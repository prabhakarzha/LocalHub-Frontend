import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { eventId } = req.body;

    const booking = await Booking.create({
      userId: req.user.id,
      eventId,
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to book event" });
  }
};

// Get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate(
      "eventId"
    );
    res.json({ success: true, bookings });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Booking.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to cancel booking" });
  }
};
