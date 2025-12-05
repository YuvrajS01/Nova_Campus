import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/authMiddleware';
import prisma from '../prisma/client';

const router = Router();

// Get all events
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const events = await prisma.event.findMany({
            orderBy: { startTime: 'asc' },
            include: {
                registrations: userId ? {
                    where: { userId },
                    select: { id: true }
                } : false,
            }
        });

        // Add isRegistered flag
        const eventsWithRegistration = events.map(event => ({
            ...event,
            isRegistered: userId ? event.registrations && event.registrations.length > 0 : false,
            registrations: undefined, // Remove the registrations array from response
        }));

        res.json(eventsWithRegistration);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

// Register for an event
router.post('/:id/register', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const eventId = req.params.id;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Check if event exists
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        // Check if already registered
        const existingRegistration = await prisma.eventRegistration.findUnique({
            where: {
                eventId_userId: { eventId, userId }
            }
        });

        if (existingRegistration) {
            res.status(400).json({ message: 'Already registered for this event' });
            return;
        }

        // Check registration deadline
        if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
            res.status(400).json({ message: 'Registration deadline has passed' });
            return;
        }

        await prisma.eventRegistration.create({
            data: { eventId, userId }
        });

        res.status(201).json({ message: 'Successfully registered for event' });
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ message: 'Failed to register for event' });
    }
});

// Create event (staff/admin only)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, startTime, endTime, location, registrationDeadline } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
            res.status(403).json({ message: 'Only staff and admin can create events' });
            return;
        }

        // Validate required fields
        if (!title || !description || !startTime || !endTime || !location) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                location,
                registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
                createdById: userId,
            },
        });

        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Failed to create event' });
    }
});

// Delete event (staff/admin only)
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
            res.status(403).json({ message: 'Only staff and admin can delete events' });
            return;
        }

        await prisma.event.delete({ where: { id } });
        res.json({ message: 'Event deleted' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Failed to delete event' });
    }
});

export default router;
