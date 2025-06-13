// src/controllers/userController.js (or .ts)
import { User } from "../models/user/user.model.js"; // Adjust path as needed
import { ShortURL } from "../models/shorturl.model.js"; // Need to import ShortURL model

/**
 * Get details of the authenticated user.
 * GET /api/user/me
 */
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user?._id; // Get userId from the authenticated request

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all short URLs created by the authenticated user with pagination.
 * GET /api/user/my-urls?page=1&limit=10
 */
export const getAllUserShortURLs = async (req, res) => {
  try {

    console.log(req.user);
    
    const userId = req.user?.id || ""; // Get userId from the authenticated request

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shortURLs = await ShortURL.find({ userId: userId, isActive: true })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    const totalShortURLs = await ShortURL.countDocuments({
      userId: userId,
      isActive: true,
    });

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(totalShortURLs / limit),
      totalItems: totalShortURLs,
      shortURLs,
    });
  } catch (error) {
    console.error("Error fetching user short URLs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update user details (e.g., username, email - excluding password usually).
 * PATCH /api/user/me
 */
export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user?._id;
    const updates = req.body; // e.g., { username: 'newusername', email: 'newemail@example.com' }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // Prevent direct password updates here; handle them via a separate "change password" route
    delete updates.password;
    delete updates.role; // Prevent unauthorized role changes

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user details:", error);
    // Handle validation errors specifically
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res
        .status(409)
        .json({
          message:
            "Duplicate key error (e.g., username or email already exists).",
          error: error.message,
        });
    }
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
