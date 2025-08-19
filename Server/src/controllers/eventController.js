import Event from "../models/Event.js";

import cloudinary from "../utils/cloudinary.js";
// Create Event

export const createEvent = async (req, res) => {
  try {
    console.log("Incoming Event Data:", req.body);
    console.log("Uploaded File (Multer):", req.file);

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    // Upload with transformation (smart crop + supported formats)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "localhub/events",
      transformation: [
        {
          width: 400,
          height: 250,
          crop: "fill",
          gravity: "auto", // smart subject/face centering
        },
      ],
      allowed_formats: ["jpg", "jpeg", "png"], // allow all common formats
    });

    // Ensure final URL is always transformed
    const transformedUrl = result.secure_url.replace(
      "/upload/",
      "/upload/w_400,h_250,c_fill,g_auto/"
    );

    const event = await Event.create({
      ...req.body,
      image: transformedUrl,
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error("Event creation failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getEventCount = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    res.status(200).json({ totalEvents });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
