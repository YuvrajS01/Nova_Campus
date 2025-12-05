import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/authMiddleware';
import prisma from '../prisma/client';
import { isValidSemester, isValidCGPA, SEMESTERS } from '../constants';

const router = Router();

// Get CGPA records for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const cgpaRecords = await prisma.studentCGPA.findMany({
            where: { userId },
            orderBy: { semester: 'asc' },
        });

        res.json(cgpaRecords);
    } catch (error) {
        console.error('Error fetching CGPA records:', error);
        res.status(500).json({ message: 'Failed to fetch CGPA records' });
    }
});

// Get CGPA records for a specific user (admin only)
router.get('/:userId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const requesterId = req.user?.userId;
        const { userId } = req.params;

        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const requester = await prisma.user.findUnique({ where: { id: requesterId } });
        if (!requester || requester.role !== 'admin') {
            res.status(403).json({ message: 'Only admin can view other users\' CGPA records' });
            return;
        }

        const cgpaRecords = await prisma.studentCGPA.findMany({
            where: { userId },
            orderBy: { semester: 'asc' },
        });

        res.json(cgpaRecords);
    } catch (error) {
        console.error('Error fetching CGPA records:', error);
        res.status(500).json({ message: 'Failed to fetch CGPA records' });
    }
});

// Create or update CGPA for a semester (admin only)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId, semester, cgpa } = req.body;
        const requesterId = req.user?.userId;

        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const requester = await prisma.user.findUnique({ where: { id: requesterId } });
        if (!requester || requester.role !== 'admin') {
            res.status(403).json({ message: 'Only admin can create/update CGPA records' });
            return;
        }

        // Validate required fields
        if (!userId || semester === undefined || cgpa === undefined) {
            res.status(400).json({ message: 'Missing required fields: userId, semester, cgpa' });
            return;
        }

        // Validate semester
        const semesterNum = parseInt(semester);
        if (!isValidSemester(semesterNum)) {
            res.status(400).json({ message: `Invalid semester. Must be one of: ${SEMESTERS.join(', ')}` });
            return;
        }

        // Validate CGPA
        const cgpaNum = parseFloat(cgpa);
        if (!isValidCGPA(cgpaNum)) {
            res.status(400).json({ message: 'Invalid CGPA. Must be between 0.0 and 10.0' });
            return;
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Upsert CGPA record
        const cgpaRecord = await prisma.studentCGPA.upsert({
            where: {
                userId_semester: {
                    userId,
                    semester: semesterNum,
                },
            },
            update: {
                cgpa: cgpaNum,
            },
            create: {
                userId,
                semester: semesterNum,
                cgpa: cgpaNum,
            },
        });

        res.status(201).json(cgpaRecord);
    } catch (error) {
        console.error('Error creating/updating CGPA record:', error);
        res.status(500).json({ message: 'Failed to create/update CGPA record' });
    }
});

// Delete CGPA record (admin only)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const requesterId = req.user?.userId;

        if (!requesterId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const requester = await prisma.user.findUnique({ where: { id: requesterId } });
        if (!requester || requester.role !== 'admin') {
            res.status(403).json({ message: 'Only admin can delete CGPA records' });
            return;
        }

        await prisma.studentCGPA.delete({ where: { id } });
        res.json({ message: 'CGPA record deleted' });
    } catch (error) {
        console.error('Error deleting CGPA record:', error);
        res.status(500).json({ message: 'Failed to delete CGPA record' });
    }
});

export default router;
