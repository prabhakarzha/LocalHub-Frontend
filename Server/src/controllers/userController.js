import User from "../models/User.js"; // Mongoose User model

export const getUserCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
