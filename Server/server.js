import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";

console.log("ENV TEST:", {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing",
});

connectDB();

const app = express();

// Allow localhost (dev) and Vercel (prod)
const allowedOrigins = [
  "http://localhost:3000",
  "https://local-hub.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all methods
<<<<<<< HEAD
    allowedHeaders: ["Content-Type", "Authorization"], // Required for login/signup
=======
    allowedHeaders: ["Content-Type", "Authorization"],    // Required for login/signup
>>>>>>> 17d8642fe5ec40b98d26c13299dc0b67138cb9f6
  })
);

// Handle preflight requests explicitly (for mobile)
app.options("*", cors());

app.use(express.json());

// API Routes
app.get("/", (req, res) => {
  res.send("LocalHub Backend is running 🚀");
});
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);

const PORT = process.env.PORT || 5000;
console.log(
  "Routes loaded:",
  app._router.stack.map((r) => r.route?.path).filter(Boolean)
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
