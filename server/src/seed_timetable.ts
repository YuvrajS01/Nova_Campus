import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const timetableData = [
    // Monday
    { dayOfWeek: 1, startTime: '10:00', endTime: '11:00', subject: 'Biology For Engineers', room: '204', faculty: null },
    { dayOfWeek: 1, startTime: '11:00', endTime: '12:00', subject: 'Cyber Security', room: '204', faculty: 'Dr. Pratik Ranjan' },
    { dayOfWeek: 1, startTime: '12:00', endTime: '13:00', subject: 'E-Commerce & ERP', room: '204', faculty: 'Dr. Kanchan Bala' },

    // Tuesday
    { dayOfWeek: 2, startTime: '11:00', endTime: '13:00', subject: 'Python Lab', room: '204', faculty: 'Prof. Ashish Kumar' },

    // Wednesday
    { dayOfWeek: 3, startTime: '10:00', endTime: '11:00', subject: 'Cyber Security', room: '204', faculty: 'Dr. Pratik Ranjan' },
    { dayOfWeek: 3, startTime: '11:00', endTime: '12:00', subject: 'Biology For Engineers', room: '204', faculty: null },
    { dayOfWeek: 3, startTime: '12:00', endTime: '13:00', subject: 'Soft Skills & Interpersonal Communication', room: '204', faculty: 'Dr. Anil Kumar Singh' },

    // Thursday
    { dayOfWeek: 4, startTime: '10:00', endTime: '11:00', subject: 'E-Commerce & ERP', room: '204', faculty: 'Dr. Kanchan Bala' },
    { dayOfWeek: 4, startTime: '11:00', endTime: '12:00', subject: 'Biology For Engineers', room: '204', faculty: null },
    { dayOfWeek: 4, startTime: '12:00', endTime: '13:00', subject: 'Soft Skills & Interpersonal Communication', room: '204', faculty: 'Dr. Anil Kumar Singh' },

    // Friday
    { dayOfWeek: 5, startTime: '10:00', endTime: '11:00', subject: 'E-Commerce & ERP', room: '204', faculty: 'Dr. Kanchan Bala' },
    { dayOfWeek: 5, startTime: '11:00', endTime: '12:00', subject: 'Cyber Security', room: '204', faculty: 'Dr. Pratik Ranjan' },
    { dayOfWeek: 5, startTime: '12:00', endTime: '13:00', subject: 'Soft Skills & Interpersonal Communication', room: '204', faculty: 'Dr. Anil Kumar Singh' },

    // Saturday
    { dayOfWeek: 6, startTime: '11:00', endTime: '13:00', subject: 'Python Lab', room: '204', faculty: 'Prof. Ashish Kumar' },
];

async function main() {
    console.log('Seeding timetable for CSE Year 4 Section A...');

    // Delete existing entries for this specific group to avoid duplicates
    await prisma.timetableEntry.deleteMany({
        where: {
            branch: 'CSE',
            year: 4,
            section: 'A'
        }
    });

    for (const entry of timetableData) {
        await prisma.timetableEntry.create({
            data: {
                branch: 'CSE',
                year: 4,
                section: 'A',
                ...entry
            }
        });
    }

    console.log('Timetable seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
