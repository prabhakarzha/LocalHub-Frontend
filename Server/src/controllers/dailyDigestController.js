import Event from "../models/Event.js";
import Service from "../models/Service.js";

/**
 * Generate a daily digest for the logged-in user
 */
export const generateDailyDigest = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Fetch top 3 services created by user
    const topServices = await Service.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(3);

    // ✅ Fetch top 3 upcoming events (user created or recommended)
    const topEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(3);

    // ✅ Insights (simple AI-style logic)
    const insights = [];
    if (topServices.length) {
      insights.push(
        `You have ${topServices.length} services active. Keep adding more!`
      );
    } else {
      insights.push("You haven't added any services yet. Start now!");
    }

    if (topEvents.length) {
      insights.push(`You have ${topEvents.length} upcoming events this week.`);
    }

    // ✅ AI Suggestions
    const suggestions = [
      "Try adding a new business service to attract more customers.",
      "Check out trending events in your area today.",
      "Update your service images to make them more appealing.",
    ];

    res.json({
      topServices,
      topEvents,
      insights,
      suggestions,
    });
  } catch (error) {
    console.error("Daily Digest Error:", error);
    res.status(500).json({ message: "Failed to generate daily digest" });
  }
};
