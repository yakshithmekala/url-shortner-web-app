import { ShortURL } from "../models/shorturl.model.js"; // Adjust path as needed
import { nanoid } from "nanoid"; // You'll need to install nanoid: npm install nanoid

export const createShortURL = async (req, res) => {
  try {

    const userId = req.user.id;
    const { originalUrl, expiresAt, title, utm } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "Original URL is required." });
    }

    let shortCode = nanoid(7);
    let isUnique = false;
    while (!isUnique) {
      const existingURL = await ShortURL.findOne({ shortCode });
      if (!existingURL) {
        isUnique = true;
      } else {
        shortCode = nanoid(7);
      }
    }

    let finalExpiresAt = null; // Initialize as null

    // Check if expiresAt is provided and is a non-empty string after trimming whitespace
    if (expiresAt && typeof expiresAt === "string" && expiresAt.trim() !== "") {
      const parsedDate = new Date(expiresAt);
      // Check if the parsed date is valid (e.g., not "Invalid Date")
      if (!isNaN(parsedDate.getTime())) {
        finalExpiresAt = parsedDate;
      } else {
        // If the provided string is invalid, you might want to return an error
        return res
          .status(400)
          .json({ message: "Invalid expiresAt date format." });
      }
    } else {
      // If expiresAt is not provided or is empty/whitespace, set it to 30 days from now
      const date = new Date();
      date.setDate(date.getDate() + 30);
      finalExpiresAt = date;
    }

    const newShortURL = new ShortURL({
      originalUrl,
      shortCode,
      userId: userId || null,
      expiresAt: finalExpiresAt, // Use the determined expiration date
      title: title || null,
      utm: utm || {},
    });

    await newShortURL.save();
    res.status(201).json(newShortURL);
  } catch (error) {
    console.error("Error creating short URL:", error);
    // Be more specific if it's a validation error
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAndRedirectShortURL = async (req, res) => {
  try {
    const { shortCode } = req.params; // Assuming shortCode is passed as a URL parameter

    const shortURL = await ShortURL.findOne({ shortCode, isActive: true });

    if (!shortURL) {
      return res
        .status(404)
        .json({ message: "Short URL not found or inactive." });
    }

    if (shortURL.expiresAt && shortURL.expiresAt < new Date()) {
      // Optionally, you might want to deactivate the URL here
      shortURL.isActive = false;
      await shortURL.save();
      return res.status(410).json({ message: "Short URL has expired." });
    }

    // Increment click count (optional, but good for analytics)
    shortURL.clickCount = (shortURL.clickCount || 0) + 1;
    await shortURL.save();

    return res.redirect(shortURL.originalUrl);
  } catch (error) {
    console.error("Error retrieving short URL:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateShortURL = async (req, res) => {
  try {
    const { shortCode } = req.params; // Assuming shortCode identifies the URL to update
    const updates = req.body; // Contains the fields to update

    const shortURL = await ShortURL.findOne({ shortCode });

    if (!shortURL) {
      return res.status(404).json({ message: "Short URL not found." });
    }

    // Apply updates
    Object.assign(shortURL, updates);

    await shortURL.save();
    res.status(200).json(shortURL);
  } catch (error) {
    console.error("Error updating short URL:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const softDeleteShortURL = async (req, res) => {
  try {
    const { shortCode } = req.params; // Assuming shortCode identifies the URL to soft delete

    const shortURL = await ShortURL.findOne({ shortCode });

    if (!shortURL) {
      return res.status(404).json({ message: "Short URL not found." });
    }

    shortURL.isActive = false;
    await shortURL.save();

    res.status(200).json({ message: "Short URL soft deleted successfully." });
  } catch (error) {
    console.error("Error soft deleting short URL:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
