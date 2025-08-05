import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: String, default: "Free" },
    image: { type: String, default: "" }, // Cloudinary ya local upload ka URL
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
