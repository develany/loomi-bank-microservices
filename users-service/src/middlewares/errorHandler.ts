import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ErrorMessages } from "../constants/errorMessages";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Handle specific error messages
  if (err.message === ErrorMessages.USER_NOT_FOUND) {
    return res.status(404).json({ message: err.message });
  }

  if (err.message === ErrorMessages.EMAIL_IN_USE) {
    return res.status(400).json({ message: err.message });
  }

  // Default server error
  return res.status(500).json({ message: "Internal server error" });
}
