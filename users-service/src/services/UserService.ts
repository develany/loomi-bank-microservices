import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { AppDataSource } from '../config/database';
import { redis } from '../config/redis';
import { EventService } from '../services/EventService';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository(AppDataSource);
    }

    async findById(userId: string): Promise<User | null> {
        // Try to get from cache first
        const cacheKey = `user:${userId}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        // If not in cache, get from database
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Store in cache for 1 minute
        await redis.set(cacheKey, JSON.stringify(user), 'EX', 60);
        return user;
    }

    async update(userId: string, data: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (data.email && data.email !== user.email) {
            const existingUser = await this.userRepository.findByEmail(data.email);
            if (existingUser) {
                throw new Error('Email already in use');
            }
        }

        const updatedUser = await this.userRepository.updateUser(userId, data);
        if (!updatedUser) {
            throw new Error('Failed to update user');
        }

        // Invalidate cache
        await redis.del(`user:${userId}`);

        // Publish update event
        await EventService.publishUserUpdated(userId);

        return updatedUser;
    }

    async updateProfilePicture(userId: string, profilePicture: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = await this.userRepository.updateProfilePicture(userId, profilePicture);
        if (!updatedUser) {
            throw new Error('Failed to update profile picture');
        }

        return updatedUser;
    }
}