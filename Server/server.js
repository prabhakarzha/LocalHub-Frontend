import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import serviceBookingRoutes from "./src/routes/serviceBookingRoutes.js";
import activeUserRoutes from "./src/routes/activeUserRoutes.js";

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

// ✅ CORS middleware
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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ Added PATCH
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests explicitly
app.options(
  "*",
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.get("/", (req, res) => {
  res.send("LocalHub Backend is running 🚀");
});
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/servicebookings", serviceBookingRoutes);
app.use("/api/users", activeUserRoutes);

const PORT = process.env.PORT || 5000;
console.log(
  "Routes loaded:",
  app._router.stack.map((r) => r.route?.path).filter(Boolean)
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
