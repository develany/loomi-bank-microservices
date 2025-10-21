import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  validateUpdateUser,
  validateProfilePicture,
} from "../middlewares/validateRequest";

const router = Router();
const userController = new UserController();

// Get all users with pagination
router.get("/users", asyncHandler(userController.findAll.bind(userController)));

// Get user by ID
router.get(
  "/users/:userId",
  asyncHandler(userController.findOne.bind(userController))
);

// Update user
router.patch(
  "/users/:userId",
  validateUpdateUser,
  asyncHandler(userController.update.bind(userController))
);

// Update profile picture
router.patch(
  "/users/:userId/profile-picture",
  validateProfilePicture,
  asyncHandler(userController.updateProfilePicture.bind(userController))
);

export default router;
