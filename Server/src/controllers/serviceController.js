import Service from "../models/Service.js";

// Create Service
export const createService = async (req, res) => {
  console.log("[ServiceController] createService called");
  try {
    const { title, category, description, contact, price } = req.body;

    const image = req.file ? req.file.path : "";
    console.log("[ServiceController] Data Received:", {
      title,
      category,
      contact,
      price,
      image,
    });

    const service = await Service.create({
      title,
      category,
      description,
      contact,
      price,
      image,
    });

    console.log("[ServiceController] Service Created (ID):", service._id);
    res.status(201).json(service);
  } catch (error) {
    console.error("[ServiceController] Error:", error.message);
    res.status(500).json({ message: "Failed to create service" });
  }
};

// Get All Services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error("[ServiceController] Fetch Error:", error.message);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// Update Service
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
    console.error("[ServiceController] Update Error:", error.message);
    res.status(500).json({ message: "Failed to update service" });
  }
};

// Delete Service
export const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("[ServiceController] Delete Error:", error.message);
    res.status(500).json({ message: "Failed to delete service" });
  }
};
