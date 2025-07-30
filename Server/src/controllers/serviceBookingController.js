// controllers/serviceController.js
import ServiceBooking from "../models/serviceBooking.js";

// Create a new service booking
export const createServiceBooking = async (req, res) => {
  try {
    const { serviceId, message, contactInfo } = req.body;

    const booking = await ServiceBooking.create({
      userId: req.user.id,
      serviceId,
      message,
      contactInfo,
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to book service" });
  }
};

// Get all service bookings for a user
export const getUserServiceBookings = async (req, res) => {
  try {
    const bookings = await ServiceBooking.find({
      userId: req.user.id,
    }).populate("serviceId");
    res.json({ success: true, bookings });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch service bookings" });
  }
};

// Cancel a service booking
export const cancelServiceBooking = async (req, res) => {
  try {
    const booking = await ServiceBooking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Service booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await ServiceBooking.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: "Service booking cancelled" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to cancel service booking" });
  }
};
