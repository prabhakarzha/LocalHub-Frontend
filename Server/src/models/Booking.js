// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    default: "confirmed", // confirmed | cancelled
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Booking", bookingSchema);
