import { Request, Response, NextFunction } from 'express';

export function mockAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    return next();
}