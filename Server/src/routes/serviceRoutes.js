import express from "express";
import {
  createService,
  getServices,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Debug: Route-level log (sirf POST ke liye, kyunki error wahi aata hai)
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

router.get("/", getServices);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
