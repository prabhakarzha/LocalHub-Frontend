import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Tutor", "Repair", "Business"],
      required: [true, "Service category is required"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Contact info is required"],
    },
    price: {
      type: String,
      default: "Free",
    },
    image: {
      type: String,
      default: "",
    },

    // ✅ Service creator reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Optional approval status (like events)
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Optional: Indexing for faster queries by status
serviceSchema.index({ status: 1 });

export default mongoose.models.Service ||
  mongoose.model("Service", serviceSchema);
