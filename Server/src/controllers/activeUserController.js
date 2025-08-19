import User from "../models/User.js";

export const getActiveUsers = async (req, res) => {
  try {
    const count = await User.countDocuments({ isActive: true });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
