import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables here to ensure they exist
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debugging log
console.log("Cloudinary Config Check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "Missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing",
});

export default cloudinary;
