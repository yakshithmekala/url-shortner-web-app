// src/routes/userRouter.js (or .ts)
import { Router } from 'express';
import {
  getUserDetails,
  getAllUserShortURLs,
  updateUserDetails,
} from '../controllers/userController.js'; // Adjust path as needed
import { privateRoute } from '../middlewares/authMiddleware.js'; // Your authentication middleware

const userRouter = Router();

// Route to get the authenticated user's own details
userRouter.get('/me', privateRoute, getUserDetails);

// Route to get all short URLs created by the authenticated user, with pagination
userRouter.get('/my-urls', privateRoute, getAllUserShortURLs);

// Route to update details for the authenticated user
userRouter.patch('/me', privateRoute, updateUserDetails);

// You might also have routes for admin users to manage all users,
// but these would need an additional middleware to check for 'admin' role.
// Example: userRouter.get('/', privateRoute, adminRoute, getAllUsers);

export default userRouter;