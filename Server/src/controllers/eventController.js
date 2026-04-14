import Event from "../models/Event.js";
import cloudinary from "../utils/cloudinary.js";

/* ---------------- CREATE EVENT ---------------- */
export const createEvent = async (req, res) => {
  try {
    console.log("\n=== [EventController] createEvent called ===");
    console.log("Incoming Event Data:", req.body);
    console.log("Uploaded File (Multer):", req.file);

    // ✅ Log user info
    console.log("User creating event:", {
      userId: req.user?._id,
      userEmail: req.user?.email,
      userRole: req.user?.role,
    });

    if (!req.file) {
      console.error("[ERROR] No image uploaded");
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    console.log("[DEBUG] Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "localhub/events",
      transformation: [
        { width: 400, height: 250, crop: "fill", gravity: "auto" },
      ],
      allowed_formats: ["jpg", "jpeg", "png"],
    });

    const transformedUrl = result.secure_url.replace(
      "/upload/",
      "/upload/w_400,h_250,c_fill,g_auto/",
    );
    console.log("[DEBUG] Cloudinary upload successful:", transformedUrl);

    const createdBy = req.user?._id || null;
    const userRole = req.user?.role || "user";
    const eventStatus = userRole === "admin" ? "approved" : "pending";

    console.log("[DEBUG] Event details:", {
      createdBy,
      userRole,
      eventStatus,
    });

    const event = await Event.create({
      ...req.body,
      image: transformedUrl,
      createdBy,
      status: eventStatus,
    });

    console.log("[EventController] Event Created:", {
      id: event._id,
      title: event.title,
      createdBy: event.createdBy,
      status: event.status,
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

/* ---------------- GET ALL EVENTS (For Admin - includes pending) ---------------- */
// ✅ This is the main function that will be called by the frontend
export const getEvents = async (req, res) => {
  console.log("\n=== [EventController] getEvents called ===");

  console.log("User from request:", {
    userId: req.user?._id,
    userRole: req.user?.role,
    userEmail: req.user?.email,
  });

  try {
    // If admin: get all events, if normal user: get only approved
    const query = req.user?.role === "admin" ? {} : { status: "approved" };

    console.log("Using query:", query);

    // ✅ FIXED: Populate with "name" field (not "username")
    const events = await Event.find(query)
      .populate("createdBy", "name email role") // ✅ "name" - matches User schema
      .sort({ createdAt: -1 });

    console.log(
      `[DEBUG] Found ${events.length} events (Admin: ${req.user?.role === "admin"})`,
    );

    const pendingCount = events.filter((e) => e.status === "pending").length;
    console.log(`[DEBUG] Pending events in response: ${pendingCount}`);

    console.log(
      "First 3 event statuses:",
      events.slice(0, 3).map((e) => ({ title: e.title, status: e.status })),
    );

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ---------------- GET ALL EVENTS (ADMIN) with Pagination ---------------- */
export const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalEvents = await Event.countDocuments();

    const events = await Event.find()
      .populate("createdBy", "name email role") // ✅ FIXED: "name" instead of "username"
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ---------------- GET APPROVED EVENTS ---------------- */
export const getApprovedEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await Event.countDocuments({ status: "approved" });
    const events = await Event.find({ status: "approved" })
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email role"); // ✅ FIXED: "name"

    res.status(200).json({
      success: true,
      events,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching approved events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- GET USER EVENTS ---------------- */
export const getUserEvents = async (req, res) => {
  try {
    const userId = req.user?._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await Event.countDocuments({ createdBy: userId });
    const events = await Event.find({ createdBy: userId })
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email role"); // ✅ FIXED: "name"

    res.status(200).json({
      success: true,
      events,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- UPDATE EVENT STATUS (ADMIN) ---------------- */
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

/* ---------------- UPDATE EVENT ---------------- */
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

/* ---------------- DELETE EVENT ---------------- */
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ---------------- GET EVENT COUNT ---------------- */
export const getEventCount = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    res.status(200).json({ totalEvents });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET PENDING EVENTS (ADMIN) ---------------- */
export const getPendingEvents = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await Event.countDocuments({ status: "pending" });
    const pendingEvents = await Event.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email role"); // ✅ FIXED: "name"

    res.status(200).json({
      success: true,
      events: pendingEvents,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching pending events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
