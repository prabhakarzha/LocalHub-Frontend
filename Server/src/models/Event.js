import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    price: {
      type: String,
      default: "Free",
    },
    image: {
      type: String,
      default: "",
    },

    // ✅ Event creator reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Event approval status
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Optional: Indexing for faster queries
eventSchema.index({ status: 1 });

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
