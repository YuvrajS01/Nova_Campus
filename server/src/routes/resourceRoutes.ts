import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/authMiddleware';
import prisma from '../prisma/client';
import { isValidBranch, isValidYear, BRANCHES, YEARS } from '../constants';

const router = Router();

// Get resources (filtered by branch/year for students, all for admin)
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

        // Admin/staff see all, students see filtered by their branch/year
        let where: any = {};
        if (user.role !== 'staff' && user.role !== 'admin') {
            where.OR = [
                { branch: null, year: null }, // General resources
                { branch: user.branch },
                { year: user.year },
            ];
        }

        const resources = await prisma.resource.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                createdBy: {
                    select: { name: true }
                }
            }
        });
        res.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ message: 'Failed to fetch resources' });
    }
});

// Create resource (staff/admin only)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log('Create Resource Request Body:', req.body);
        const { title, subject, semester, branch, year, type, url } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
            res.status(403).json({ message: 'Only staff and admin can create resources' });
            return;
        }

        // Validate college structure constraints if provided
        if (branch && !isValidBranch(branch)) {
            res.status(400).json({ message: `Invalid branch. Must be one of: ${BRANCHES.join(', ')}` });
            return;
        }

        const parsedYear = year ? parseInt(year) : null;
        if (year && parsedYear !== null && !isValidYear(parsedYear)) {
            console.log('Invalid year:', year, parsedYear);
            res.status(400).json({ message: `Invalid year. Must be one of: ${YEARS.join(', ')}` });
            return;
        }

        console.log('Creating resource with:', {
            title,
            subject,
            semester: semester || null,
            branch: branch || null,
            year: parsedYear,
            type: type || 'pdf',
            url,
            createdById: userId,
        });

        const resource = await prisma.resource.create({
            data: {
                title,
                subject,
                semester: semester || null,
                branch: branch || null,
                year: parsedYear,
                type: type || 'pdf',
                url,
                createdById: userId,
            },
        });

        res.status(201).json(resource);
    } catch (error) {
        console.error('Error creating resource:', error);
        // @ts-ignore
        if (error.code) console.error('Error code:', error.code);
        // @ts-ignore
        if (error.meta) console.error('Error meta:', error.meta);
        res.status(500).json({ message: 'Failed to create resource', error: String(error) });
    }
});

// Delete resource (staff/admin only)
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
            res.status(403).json({ message: 'Only staff and admin can delete resources' });
            return;
        }

        await prisma.resource.delete({ where: { id } });
        res.json({ message: 'Resource deleted' });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({ message: 'Failed to delete resource' });
    }
});

export default router;
