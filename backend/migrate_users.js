const bcrypt = require('bcryptjs');
const { query } = require('./database');

const originalUsers = [
    { username: 'committee1', password: 'sankranthi2026', role: 'committee' },
    { username: 'finance', password: 'finance2026', role: 'financial_manager' },
    { username: 'ganesh', password: '123456', role: 'financial_manager' }, // Ganesh is already there but let's be sure
    { username: 'events', password: 'events2026', role: 'event_manager' },
    { username: 'photos', password: 'photos2026', role: 'photo_head' },
    { username: 'judge1', password: 'judge2026', role: 'judge' },
    { username: 'judge2', password: 'judge2026', role: 'judge' },
];

async function migrate() {
    console.log('--- Migrating original users ---');
    for (const user of originalUsers) {
        try {
            const existing = await query.get('SELECT * FROM users WHERE username = ?', [user.username.toLowerCase()]);
            if (existing) {
                console.log(`Skipping existing user: ${user.username}`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);
            const id = 'legacy_' + Date.now() + Math.random().toString(36).substr(2, 5);

            await query.run(
                'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
                [id, user.username.toLowerCase(), hashedPassword, user.role]
            );
            console.log(`Successfully added: ${user.username}`);
        } catch (err) {
            console.error(`Error adding ${user.username}:`, err.message);
        }
    }
    console.log('--- Migration complete ---');
    process.exit();
}

migrate();
