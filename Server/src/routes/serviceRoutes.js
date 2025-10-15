import express from "express";
import {
  createService,
  getServices,
  getUserServices,
  getPendingServices,
  updateServiceStatus,
  updateService,
  deleteService,
  getServiceCount,
} from "../controllers/serviceController.js";
import { upload } from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* 
===========================
   📦 USER ROUTES
===========================
*/

// ✅ Keep existing POST route with debug log intact
router.post(
  "/",
  upload.single("image"),
  (req, res, next) => {
    console.log("[ServiceRoutes] POST / - Body:", req.body);
    if (req.file) console.log("[ServiceRoutes] File uploaded:", req.file.path);
    next();
  },
  createService
);

// ✅ Get approved services (visible to normal users)
router.get("/", authMiddleware, getServices);

// ✅ Get all services created by the logged-in user (dashboard)
router.get("/user", authMiddleware, getUserServices);

/* 
===========================
   🛡️ ADMIN ROUTES
===========================
*/

// ✅ Get only pending services (for admin approval panel)
router.get("/pending", authMiddleware, getPendingServices);

// ✅ Get all services (admin dashboard)
router.get("/admin", authMiddleware, getServices);

// ✅ Approve or Decline service (admin only)
router.patch("/:id/status", authMiddleware, updateServiceStatus);

/* 
===========================
   ⚙️ COMMON ROUTES
===========================
*/

// ✅ Update service details
router.put("/:id", authMiddleware, updateService);

// ✅ Delete service
router.delete("/:id", authMiddleware, deleteService);

// ✅ Get total count of all services
router.get("/count", authMiddleware, getServiceCount);

export default router;
