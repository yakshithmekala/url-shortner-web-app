import { Router } from "express";
import {
  createShortURL,
  getAndRedirectShortURL,
  updateShortURL,
  softDeleteShortURL,
} from "./../controllers/shortURLController.js"; // Adjust path as needed
import { privateRoute } from "../middlewares/authMiddleware.js";

const shortURLRouter = Router();

// Route for creating a short URL
shortURLRouter.post("/", privateRoute, createShortURL);

// Route for checking and redirecting a short URL
// Note: You'll need to modify your GET route to accept a parameter
shortURLRouter.get("/:shortCode", privateRoute, getAndRedirectShortURL);

// Route for updating a short URL
// Note: You'll likely want to identify the URL to update by its shortCode
shortURLRouter.patch("/:shortCode", privateRoute, updateShortURL);

// Route for soft deleting a short URL
// Note: You'll likely want to identify the URL to soft delete by its shortCode
shortURLRouter.delete("/:shortCode", privateRoute, softDeleteShortURL);

export default shortURLRouter;
