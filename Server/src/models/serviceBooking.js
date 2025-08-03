// models/ServiceBooking.js
import mongoose from "mongoose";

const serviceBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  message: {
    type: String,
  },
  contactInfo: {
    type: String,
  },
  status: {
    type: String,
    default: "pending", // pending | contacted | completed | cancelled
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ServiceBooking", serviceBookingSchema);
