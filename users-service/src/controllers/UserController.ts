import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { CacheService } from "../services/CacheService";
import { EventService } from "../services/EventService";
import { AppDataSource } from "../config/database";
import { UpdateUserDto } from "../dtos/UpdateUserDto";
import { UpdateProfilePictureDto } from "../dtos/UpdateProfilePictureDto";
import { logger } from "../utils/logger";

export class UserController {
  private userService: UserService;

  constructor() {
    const userRepository = new UserRepository(AppDataSource);
    const cacheService = new CacheService();
    const eventService = new EventService();
    this.userService = new UserService(
      userRepository,
      cacheService,
      eventService
    );
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    logger.info(`Listing users with pagination: page=${page}, limit=${limit}`);

    const { users, total } = await this.userService.findAll(page, limit);

    return res.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    logger.info(`Finding user by ID: ${userId}`);

    const user = await this.userService.findById(userId);
    return res.json(user);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const data: UpdateUserDto = req.body;

    logger.info(`Updating user: ${userId}`, { data });

    const user = await this.userService.update(userId, data);
    return res.json(user);
  }

  async updateProfilePicture(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const { profilePicture } = req.body as UpdateProfilePictureDto;

    logger.info(`Updating profile picture for user: ${userId}`);

    const user = await this.userService.updateProfilePicture(
      userId,
      profilePicture
    );
    return res.json(user);
  }
}
