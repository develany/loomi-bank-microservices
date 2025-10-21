import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ErrorMessages } from "../constants/errorMessages";
import { logger } from "../utils/logger";

export function mockAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    logger.warn("Unauthorized access attempt", {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    throw new AppError(ErrorMessages.UNAUTHORIZED, 401);
  }

  // In a real implementation, we would validate the token here
  logger.debug("User authenticated", { token: token.substring(0, 10) + "..." });

  return next();
}
