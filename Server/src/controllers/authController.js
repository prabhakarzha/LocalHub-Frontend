import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { hashPassword, comparePassword } from "../utils/hash.js"; // import hashing utilities

// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password); // hash password

    const user = await User.create({ name, email, password: hashedPassword }); // store hashed password
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const isMatch = user && (await comparePassword(password, user.password)); // compare with hashed password

    if (isMatch) {
      res.status(200).json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.isAdmin ? "admin" : "user",
          token: generateToken(user._id),
          // ✅ this line must be exact
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile (Protected)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
