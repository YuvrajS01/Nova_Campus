import { Router, Request, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/authMiddleware';
import prisma from '../prisma/client';

const router = Router();

// Get all announcements
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                createdBy: {
                    select: { name: true }
                }
            }
        });
        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Failed to fetch announcements' });
    }
});

// Create announcement (staff/admin only)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, body, tag, isImportant } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Check if user is staff or admin
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
            res.status(403).json({ message: 'Only staff and admin can create announcements' });
            return;
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                body,
                tag,
                isImportant: isImportant || false,
                createdById: userId,
            },
        });

        res.status(201).json(announcement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Failed to create announcement' });
    }
});

// Delete announcement (staff/admin only)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
            res.status(403).json({ message: 'Only staff and admin can delete announcements' });
            return;
        }

        await prisma.announcement.delete({ where: { id } });
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Failed to delete announcement' });
    }
});

export default router;
