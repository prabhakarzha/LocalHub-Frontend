import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Tutor", "Repair", "Business"],
      required: true,
    },
    description: { type: String, required: true },
    contact: { type: String, required: true },
    price: { type: String, default: "Free" },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
