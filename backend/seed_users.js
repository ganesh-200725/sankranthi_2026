const { query } = require('./database');
const bcrypt = require('bcryptjs');

async function seedUsers() {
    console.log('--- Seeding Users ---');
    try {
        const passwordHash = await bcrypt.hash('sankranthi2026', 10);

        const users = [
            { id: '1', username: 'ganesh', password: passwordHash, role: 'committee' },
            { id: '2', username: 'committee1', password: passwordHash, role: 'committee' },
            { id: '3', username: 'finance', password: await bcrypt.hash('finance2026', 10), role: 'financial_manager' },
            { id: '4', username: 'events', password: await bcrypt.hash('events2026', 10), role: 'event_manager' },
            { id: '5', username: 'judge1', password: await bcrypt.hash('judge2026', 10), role: 'judge' }
        ];

        for (const user of users) {
            try {
                await query.run(
                    'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
                    [user.id, user.username, user.password, user.role]
                );
                console.log(`Added user: ${user.username}`);
            } catch (e) {
                console.log(`User ${user.username} already exists, skipping.`);
            }
        }
        console.log('--- User Seeding Complete ---');
    } catch (error) {
        console.error('User seeding failed:', error);
    } finally {
        process.exit();
    }
}

seedUsers();
