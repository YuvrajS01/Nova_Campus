import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/authMiddleware';
import prisma from '../prisma/client';

const router = Router();

// Search user by email (admin/staff only)
router.get('/search', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email } = req.query;
        const requesterId = req.user?.userId;

        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const requester = await prisma.user.findUnique({ where: { id: requesterId } });
        if (!requester || (requester.role !== 'admin' && requester.role !== 'staff')) {
            res.status(403).json({ message: 'Only admin and staff can search users' });
            return;
        }

        if (!email || typeof email !== 'string') {
            res.status(400).json({ message: 'Email query parameter is required' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                branch: true,
                year: true,
                section: true,
                cgpaRecords: {
                    orderBy: { semester: 'asc' },
                }
            }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Error searching user:', error);
        res.status(500).json({ message: 'Failed to search user' });
    }
});

// Get current user profile
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                branch: true,
                year: true,
                section: true,
                createdAt: true,
                cgpaRecords: {
                    orderBy: { semester: 'asc' },
                    select: {
                        id: true,
                        semester: true,
                        cgpa: true,
                    }
                }
            }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

export default router;
