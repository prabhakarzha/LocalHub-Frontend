import Service from "../models/Service.js";

// Create Service
export const createService = async (req, res) => {
  console.log("\n=== [ServiceController] createService called ===");
  console.log("[DEBUG] Full Body:", req.body);
  console.log("[DEBUG] Uploaded File:", req.file ? req.file.path : "No file");

  try {
    const { title, category, description, contact, price } = req.body;

    // Ensure category is valid (avoid enum error)
    const validCategory = ["Tutor", "Repair", "Business"].includes(category)
      ? category
      : "Tutor";

    // Validate required fields
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

    const service = await Service.create({
      title,
      category: validCategory,
      description,
      contact,
      price: price || "Free",
      image,
    });

    console.log("[ServiceController] Service Created:", {
      id: service._id,
      title: service.title,
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

// Get All Services
export const getServices = async (req, res) => {
  console.log("\n=== [ServiceController] getServices called ===");
  try {
    const services = await Service.find();
    console.log(`[DEBUG] Found ${services.length} services`);
    res.json(services);
  } catch (error) {
    console.error("[ServiceController] Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// Update Service
export const updateService = async (req, res) => {
  console.log("\n=== [ServiceController] updateService called ===");
  console.log("[DEBUG] Params ID:", req.params.id);
  console.log("[DEBUG] Body:", req.body);

  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedService) {
      console.warn("[WARN] Service not found for ID:", req.params.id);
      return res.status(404).json({ message: "Service not found" });
    }
    console.log("[DEBUG] Updated Service:", updatedService._id);
    res.json(updatedService);
  } catch (error) {
    console.error("[ServiceController] Update Error:", error);
    res.status(500).json({ message: "Failed to update service" });
  }
};

// Delete Service
export const deleteService = async (req, res) => {
  console.log("\n=== [ServiceController] deleteService called ===");
  console.log("[DEBUG] Params ID:", req.params.id);

  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn("[WARN] Service not found for ID:", req.params.id);
      return res.status(404).json({ message: "Service not found" });
    }
    console.log("[DEBUG] Deleted Service ID:", deleted._id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("[ServiceController] Delete Error:", error);
    res.status(500).json({ message: "Failed to delete service" });
  }
};
