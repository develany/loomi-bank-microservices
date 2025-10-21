import { User } from "../entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";
import { ICacheService } from "../interfaces/ICacheService";
import { IEventService } from "../interfaces/IEventService";
import { UpdateUserDto } from "../dtos/UpdateUserDto";
import { AppError } from "../utils/AppError";
import { ErrorMessages } from "../constants/errorMessages";
import { logger } from "../utils/logger";

export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private cacheService: ICacheService,
    private eventService: IEventService
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: User[]; total: number }> {
    try {
      if (typeof this.userRepository.findAll === "function") {
        const [users, total] = await this.userRepository.findAll(page, limit);
        return { users, total };
      }
      throw new AppError("Method not implemented", 500);
    } catch (error) {
      logger.error("Error finding all users", error as Error);
      throw error;
    }
  }

  async findById(userId: string): Promise<User | null> {
    try {
      // Try to get from cache first
      const cacheKey = `user:${userId}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        logger.debug(`User found in cache: ${userId}`);
        return JSON.parse(cached);
      }

      // If not in cache, get from database
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError(ErrorMessages.USER_NOT_FOUND, 404);
      }

      // Store in cache for 1 minute
      await this.cacheService.set(cacheKey, JSON.stringify(user), "EX", 60);
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error finding user by ID: ${userId}`, error as Error);
      throw new AppError("Error finding user", 500);
    }
  }

  async update(userId: string, data: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError(ErrorMessages.USER_NOT_FOUND, 404);
      }

      if (data.email && data.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
          throw new AppError(ErrorMessages.EMAIL_IN_USE, 400);
        }
      }

      const updatedUser = await this.userRepository.updateUser(userId, data);
      if (!updatedUser) {
        throw new AppError("Failed to update user", 500);
      }

      // Invalidate cache
      await this.cacheService.del(`user:${userId}`);

      // Publish update event
      await this.eventService.publishUserUpdated(userId);

      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error updating user: ${userId}`, error as Error);
      throw new AppError("Error updating user", 500);
    }
  }

  async updateProfilePicture(
    userId: string,
    profilePicture: string
  ): Promise<User> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError(ErrorMessages.USER_NOT_FOUND, 404);
      }

      const updatedUser = await this.userRepository.updateProfilePicture(
        userId,
        profilePicture
      );
      if (!updatedUser) {
        throw new AppError("Failed to update profile picture", 500);
      }

      // Invalidate cache
      await this.cacheService.del(`user:${userId}`);

      // Publish update event
      await this.eventService.publishUserUpdated(userId);

      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(
        `Error updating profile picture for user: ${userId}`,
        error as Error
      );
      throw new AppError("Error updating profile picture", 500);
    }
  }
}
