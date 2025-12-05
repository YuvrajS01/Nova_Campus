
import prisma from './prisma/client';

async function main() {
    try {
        console.log('--- Debugging Timetable Visibility (Round 2) ---');

        const today = new Date().getDay();
        console.log(`Server Date: ${new Date().toISOString()}`);
        console.log(`Server Day of Week (0=Sun, 1=Mon...): ${today}`);

        // 1. Fetch all users
        const users = await prisma.user.findMany({ take: 5 });
        const student = users.find(u => u.role === 'student');

        if (!student) {
            console.log('No student user found.');
            return;
        }

        console.log(`Student: ${student.name} (${student.id})`);
        console.log(`Student Details: Branch=${student.branch}, Year=${student.year}, Section=${student.section}`);

        // 2. Fetch all timetable entries
        const allEntries = await prisma.timetableEntry.findMany();
        console.log(`Total Timetable Entries: ${allEntries.length}`);

        // 3. Check for matches
        console.log('\nChecking for matches...');
        let matchFound = false;

        for (const entry of allEntries) {
            const branchMatch = !student.branch || entry.branch === student.branch;
            const yearMatch = !student.year || entry.year === student.year;
            const sectionMatch = !student.section || entry.section === student.section;

            const isMatch = branchMatch && yearMatch && sectionMatch;
            const isToday = entry.dayOfWeek === today;

            console.log(`Entry ${entry.id}:`);
            console.log(`  - Data: Branch=${entry.branch}, Year=${entry.year}, Section=${entry.section}, Day=${entry.dayOfWeek}`);
            console.log(`  - Matches Student? ${isMatch ? 'YES' : 'NO'} (Branch:${branchMatch}, Year:${yearMatch}, Section:${sectionMatch})`);
            console.log(`  - Is Today? ${isToday ? 'YES' : 'NO'}`);

            if (isMatch) matchFound = true;
        }

        if (!matchFound) {
            console.log('\nCONCLUSION: No timetable entries match this student profile.');
        } else {
            console.log('\nCONCLUSION: Entries exist for this student.');
            const todayMatches = allEntries.filter(e =>
                (!student.branch || e.branch === student.branch) &&
                (!student.year || e.year === student.year) &&
                (!student.section || e.section === student.section) &&
                e.dayOfWeek === today
            );
            if (todayMatches.length === 0) {
                console.log('BUT none are scheduled for TODAY. The student needs to select a different day in the UI.');
            } else {
                console.log(`AND ${todayMatches.length} entries are scheduled for TODAY. They should be visible.`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
