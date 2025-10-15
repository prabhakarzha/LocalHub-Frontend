import Service from "../models/Service.js";

// ✅ Create Service
export const createService = async (req, res) => {
  console.log("\n=== [ServiceController] createService called ===");
  console.log("[DEBUG] Full Body:", req.body);
  console.log("[DEBUG] Uploaded File:", req.file ? req.file.path : "No file");

  try {
    const { title, category, description, contact, price } = req.body;

    // Validate category value
    const validCategory = ["Tutor", "Repair", "Business"].includes(category)
      ? category
      : "Tutor";

    // Required field validation
    if (!title || !description || !contact) {
      console.error("[ERROR] Missing required fields:", {
        title,
        category,
        description,
        contact,
        price,
      });
      return res
        .status(400)
        .json({ message: "Missing required fields for service" });
    }

    const image = req.file ? req.file.path : "";
    const createdBy = req.user?._id || null;
    const userRole = req.user?.role || "user";
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
      status: service.status,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("[ServiceController] Error Creating Service:", error);
    res.status(500).json({
      message: "Failed to create service",
      error: error.message || error,
    });
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
    console.error("[ServiceController] Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch services" });
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
    console.error("[ServiceController] getUserServices Error:", error);
    res.status(500).json({ message: "Failed to fetch user services" });
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
    console.error("[ServiceController] getPendingServices Error:", error);
    res.status(500).json({ message: "Failed to fetch pending services" });
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
    console.error("[ServiceController] updateServiceStatus Error:", error);
    res.status(500).json({ message: "Failed to update service status" });
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
    console.error("[ServiceController] Update Error:", error);
    res.status(500).json({ message: "Failed to update service" });
  }
};

// ✅ Delete Service
export const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("[ServiceController] Delete Error:", error);
    res.status(500).json({ message: "Failed to delete service" });
  }
};

// ✅ Get Total Service Count
export const getServiceCount = async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    res.json({ totalServices });
  } catch (error) {
    console.error("[ServiceController] getServiceCount Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
