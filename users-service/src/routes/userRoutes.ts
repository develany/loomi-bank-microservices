import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.get('/users/:userId', (req, res) => userController.findOne(req, res));
router.patch('/users/:userId', (req, res) => userController.update(req, res));
router.patch('/users/:userId/profile-picture', (req, res) => userController.updateProfilePicture(req, res));

export default router;