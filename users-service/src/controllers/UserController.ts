import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { UpdateUserDto } from '../dtos/UpdateUserDto';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const user = await this.userService.findById(userId);
            return res.json(user);
        } catch (error) {
            if (error instanceof Error && error.message === 'User not found') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const data: UpdateUserDto = req.body;
            const user = await this.userService.update(userId, data);
            return res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User not found') {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message === 'Email already in use') {
                    return res.status(400).json({ message: error.message });
                }
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateProfilePicture(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const { profilePicture } = req.body;

            if (!profilePicture) {
                return res.status(400).json({ message: 'Profile picture is required' });
            }

            const user = await this.userService.updateProfilePicture(userId, profilePicture);
            return res.json(user);
        } catch (error) {
            if (error instanceof Error && error.message === 'User not found') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}