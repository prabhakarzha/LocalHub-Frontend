import ServiceBooking from "../models/serviceBooking.js";
import Service from "../models/Service.js";

// ✅ Create a new service booking (no user tracking)
export const createServiceBooking = async (req, res) => {
  try {
    const { serviceId, message, contactInfo } = req.body;

    // Basic validation
    if (!serviceId || !message || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: serviceId, message, or contactInfo",
      });
    }

    // Optional: Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found with the given ID",
      });
    }

    // Create booking
    const booking = await ServiceBooking.create({
      serviceId,
      message,
      contactInfo,
    });

    console.log("✅ New Booking Created:", booking);

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error("❌ Error creating service booking:", err);
    res.status(500).json({
      success: false,
      message: "Failed to book service",
      error: err.message,
    });
  }
};

// ✅ Get all service bookings (no user filter or user population)
export const getUserServiceBookings = async (req, res) => {
  try {
    const bookings = await ServiceBooking.find().populate("serviceId");

    console.log("✅ Fetched Bookings:", JSON.stringify(bookings, null, 2));

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Error fetching service bookings:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch service bookings" });
  }
};

// ✅ Cancel a service booking (no user auth check)
export const cancelServiceBooking = async (req, res) => {
  try {
    const booking = await ServiceBooking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Service booking not found" });
    }

    await ServiceBooking.deleteOne({ _id: req.params.id });

    console.log(`✅ Booking with ID ${req.params.id} cancelled`);
    res.json({ success: true, message: "Service booking cancelled" });
  } catch (err) {
    console.error("❌ Error cancelling booking:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to cancel service booking" });
  }
};
