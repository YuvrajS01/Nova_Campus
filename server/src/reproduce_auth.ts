
import prisma from './prisma/client';

async function main() {
    try {
        console.log('Attempting to create User with string year...');
        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test_year_string@example.com',
                passwordHash: 'hash',
                role: 'student',
                branch: 'CSE',
                // @ts-ignore - simulating runtime string
                year: "1",
                section: 'A',
            },
        });
        console.log('Success:', user);
    } catch (error) {
        console.error('Error creating User:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
