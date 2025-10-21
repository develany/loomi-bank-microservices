import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

// Simple validation middleware until express-validator is installed
export const validateUpdateUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { name, email, address, bankingDetails } = req.body;

  if (email && !isValidEmail(email)) {
    throw new AppError("Invalid email format", 400);
  }

  if (name && typeof name !== "string") {
    throw new AppError("Name must be a string", 400);
  }

  if (address && typeof address !== "string") {
    throw new AppError("Address must be a string", 400);
  }

  if (bankingDetails) {
    if (!bankingDetails.agency || !bankingDetails.account) {
      throw new AppError(
        "Banking details must include agency and account",
        400
      );
    }

    if (
      typeof bankingDetails.agency !== "string" ||
      typeof bankingDetails.account !== "string"
    ) {
      throw new AppError("Agency and account must be strings", 400);
    }
  }

  next();
};

export const validateProfilePicture = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { profilePicture } = req.body;

  if (!profilePicture) {
    throw new AppError("Profile picture is required", 400);
  }

  if (typeof profilePicture !== "string") {
    throw new AppError("Profile picture must be a string (URL or Base64)", 400);
  }

  next();
};

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
