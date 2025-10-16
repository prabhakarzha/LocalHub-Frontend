import Service from "../models/Service.js";

// Helper function for consistent server error handling
const handleServerError = (res, error, context = "") => {
  console.error(`[ServiceController] ${context} Error:`, error);
  res.status(500).json({
    message: `Failed to ${context}`,
    error: error.message || error,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

// ✅ Create Service
// ✅ Create Service
export const createService = async (req, res) => {
  console.log("\n=== [ServiceController] createService called ===");
  console.log("[DEBUG] Full Body:", req.body);
  console.log("[DEBUG] Uploaded File:", req.file ? req.file.path : "No file");

  try {
    const { title, category, description, contact, price } = req.body;

    // Validate category value
    const validCategory = [
      "Tutor",
      "Repair",
      "Business",
      "Cleaning",
      "Beauty",
      "Other",
    ].includes(category)
      ? category
      : "Tutor";

    // Required field validation
    if (!title?.trim() || !description?.trim() || !contact?.trim()) {
      console.error("[ERROR] Missing required fields:", req.body);
      return res
        .status(400)
        .json({ message: "Missing required fields for service" });
    }

    // Handle file safely
    let image = "";
    try {
      image = req.file?.path || "";
    } catch (fileErr) {
      console.warn("[WARN] File upload error:", fileErr);
    }

    // ✅ Ensure createdBy always exists
    const createdBy = req.user?._id || process.env.ADMIN_ID || null;
    const userRole = req.user?.role || "user";

    // If no req.user and ADMIN_ID missing, handle gracefully
    if (!createdBy) {
      console.warn(
        "[WARN] No req.user found — defaulting to admin for createdBy"
      );
    }

    const status = userRole === "admin" ? "approved" : "pending";

    const service = await Service.create({
      title,
      category: validCategory,
      description,
      contact,
      price: price || "Free",
      image,
      createdBy,
      status,
    });

    console.log("[ServiceController] Service Created:", {
      id: service._id,
      title: service.title,
      createdBy,
      status: service.status,
    });

    // ✅ Populate before sending response so frontend gets name/email
    const populatedService = await Service.findById(service._id).populate(
      "createdBy",
      "name email role"
    );

    res.status(201).json(populatedService);
  } catch (error) {
    handleServerError(res, error, "create service");
  }
};

// ✅ Get All Approved Services (Normal Users)
export const getServices = async (req, res) => {
  console.log("\n=== [ServiceController] getServices called ===");
  try {
    const services = await Service.find({ status: "approved" }).populate(
      "createdBy",
      "name email role"
    );
    console.log(`[DEBUG] Found ${services.length} approved services`);
    res.json(services);
  } catch (error) {
    handleServerError(res, error, "fetch services");
  }
};

// ✅ Get Services Created by Logged-in User
export const getUserServices = async (req, res) => {
  try {
    const userId = req.user?._id;
    const services = await Service.find({ createdBy: userId }).populate(
      "createdBy",
      "name email role"
    );
    res.json({ success: true, services });
  } catch (error) {
    handleServerError(res, error, "fetch user services");
  }
};

// ✅ Get Pending Services (Admin Only)
export const getPendingServices = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const services = await Service.find({ status: "pending" }).populate(
      "createdBy",
      "name email role"
    );
    res.json({ success: true, services });
  } catch (error) {
    handleServerError(res, error, "fetch pending services");
  }
};

// ✅ Update Service Status (Admin Only)
export const updateServiceStatus = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      success: true,
      message: `Service ${status} successfully.`,
      service,
    });
  } catch (error) {
    handleServerError(res, error, "update service status");
  }
};

// ✅ Update Service Details
export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(updatedService);
  } catch (error) {
    handleServerError(res, error, "update service");
  }
};

// ✅ Delete Service
export const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    handleServerError(res, error, "delete service");
  }
};

// ✅ Get Total Service Count
export const getServiceCount = async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    res.json({ totalServices });
  } catch (error) {
    handleServerError(res, error, "get service count");
  }
};
