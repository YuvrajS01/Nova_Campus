
import prisma from './prisma/client';

async function main() {
    try {
        console.log('Attempting to create TimetableEntry...');
        const entry = await prisma.timetableEntry.create({
            data: {
                branch: 'CSE',
                year: 1,
                section: 'A',
                dayOfWeek: 1,
                startTime: '09:00',
                endTime: '10:00',
                subject: 'Test Subject',
                room: '101',
                faculty: 'Dr. Test',
            },
        });
        console.log('Success:', entry);
    } catch (error) {
        console.error('Error creating TimetableEntry:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
