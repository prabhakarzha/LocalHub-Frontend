import Event from "../models/Event.js";
import cloudinary from "../utils/cloudinary.js";

// ✅ Create Event
export const createEvent = async (req, res) => {
  try {
    console.log("Incoming Event Data:", req.body);
    console.log("Uploaded File (Multer):", req.file);

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "localhub/events",
      transformation: [
        { width: 400, height: 250, crop: "fill", gravity: "auto" },
      ],
      allowed_formats: ["jpg", "jpeg", "png"],
    });

    const transformedUrl = result.secure_url.replace(
      "/upload/",
      "/upload/w_400,h_250,c_fill,g_auto/"
    );

    const createdBy = req.user?._id || null;
    const userRole = req.user?.role || "user";

    const eventStatus = userRole === "admin" ? "approved" : "pending";

    const event = await Event.create({
      ...req.body,
      image: transformedUrl,
      createdBy,
      status: eventStatus,
    });

    res.status(201).json({
      success: true,
      message:
        userRole === "admin"
          ? "Event created successfully and approved automatically."
          : "Event created successfully. Waiting for admin approval.",
      event,
    });
  } catch (error) {
    console.error("Event creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event. " + error.message,
    });
  }
};

// ✅ Get All Events (Admin Only)
export const getAllEvents = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const events = await Event.find()
      .sort({ date: 1 })
      .populate("createdBy", "name email role");

    console.log("Admin fetched events:", events);

    res.status(200).json({ success: true, events });
    console.log(
      "Admin fetched events:",
      events.map((e) => ({ title: e.title, status: e.status }))
    );
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Approved Events (Normal Users)
export const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" })
      .sort({ date: 1 })
      .populate("createdBy", "name email role");

    console.log("Approved events fetched:", events);

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching approved events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Events created by logged-in user (User Dashboard)
export const getUserEvents = async (req, res) => {
  try {
    const userId = req.user?._id;

    const events = await Event.find({ createdBy: userId })
      .sort({ date: 1 })
      .populate("createdBy", "name email role");

    console.log(`Events fetched for user ${userId}:`, events);

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Approve or Decline Event (Admin Only)
export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const event = await Event.findByIdAndUpdate(id, { status }, { new: true });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: `Event ${status} successfully.`,
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Event
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

// ✅ Delete Event
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Count Total Events
export const getEventCount = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    res.status(200).json({ totalEvents });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW: Get Pending Events (Admin Only)
export const getPendingEvents = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const pendingEvents = await Event.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role");

    console.log("Pending events fetched:", pendingEvents.length);

    res.status(200).json({ success: true, events: pendingEvents });
  } catch (error) {
    console.error("Error fetching pending events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
