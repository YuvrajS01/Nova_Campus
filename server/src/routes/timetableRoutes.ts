import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/authMiddleware';
import prisma from '../prisma/client';
import { isValidBranch, isValidYear, isValidSection, BRANCHES, YEARS, SECTIONS } from '../constants';

const router = Router();

// Get all timetable entries (for admin) or filtered for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Admin/staff see all entries, students see filtered
        let where: any = {};
        if (user.role !== 'staff' && user.role !== 'admin') {
            if (user.branch) where.branch = user.branch;
            if (user.year) where.year = user.year;
            if (user.section) where.section = user.section;
        }

        const timetable = await prisma.timetableEntry.findMany({
            where,
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ],
        });

        res.json(timetable);
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ message: 'Failed to fetch timetable' });
    }
});

// Create timetable entry (staff/admin only)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { branch, year, section, dayOfWeek, startTime, endTime, subject, room, faculty } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
            res.status(403).json({ message: 'Only staff and admin can create timetable entries' });
            return;
        }

        // Validate required fields
        if (!branch || !year || !section || !startTime || !endTime || !subject) {
            res.status(400).json({ message: 'Missing required fields: branch, year, section, startTime, endTime, subject' });
            return;
        }

        // Validate college structure constraints
        if (!isValidBranch(branch)) {
            res.status(400).json({ message: `Invalid branch. Must be one of: ${BRANCHES.join(', ')}` });
            return;
        }
        if (!isValidYear(parseInt(year))) {
            res.status(400).json({ message: `Invalid year. Must be one of: ${YEARS.join(', ')}` });
            return;
        }
        if (!isValidSection(section)) {
            res.status(400).json({ message: `Invalid section. Must be one of: ${SECTIONS.join(', ')}` });
            return;
        }

        const entry = await prisma.timetableEntry.create({
            data: {
                branch,
                year: parseInt(year),
                section,
                dayOfWeek: parseInt(dayOfWeek) || 0,
                startTime,
                endTime,
                subject,
                room: room || null,
                faculty: faculty || null,
            },
        });

        res.status(201).json(entry);
    } catch (error) {
        console.error('Error creating timetable entry:', error);
        res.status(500).json({ message: 'Failed to create timetable entry' });
    }
});

// Delete timetable entry (staff/admin only)
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
            res.status(403).json({ message: 'Only staff and admin can delete timetable entries' });
            return;
        }

        await prisma.timetableEntry.delete({ where: { id } });
        res.json({ message: 'Timetable entry deleted' });
    } catch (error) {
        console.error('Error deleting timetable entry:', error);
        res.status(500).json({ message: 'Failed to delete timetable entry' });
    }
});

export default router;
