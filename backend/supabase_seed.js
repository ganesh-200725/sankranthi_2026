require('dotenv').config();
const { supabase } = require('./database');
const bcrypt = require('bcryptjs');

async function seed() {
    console.log('Seeding Supabase...');

    // 1. Seed Users
    const hashedPassword = await bcrypt.hash('123456', 10);
    const users = [
        { id: '1', username: 'ganesh', password: hashedPassword, role: 'committee' },
        { id: '2', username: 'hari', password: hashedPassword, role: 'event_manager' },
        { id: '3', username: 'prakash', password: hashedPassword, role: 'financial_manager' },
        { id: '4', username: 'judge1', password: hashedPassword, role: 'judge' }
    ];

    for (const user of users) {
        const { error } = await supabase.from('users').upsert(user, { onConflict: 'username' });
        if (error) console.error('Error seeding user:', user.username, error.message);
        else console.log('Seeded user:', user.username);
    }

    // 2. Seed some initial games
    const games = [
        {
            id: 'g1',
            name: 'Musical Chairs',
            emoji: '🪑',
            date: 'January 14, 2026',
            time: '3:00 PM',
            location: 'Main Ground',
            type: 'game',
            description: 'Classic musical chairs for all ages.'
        },
        {
            id: 'g2',
            name: 'Kite Flying',
            emoji: '🪁',
            date: 'January 15, 2026',
            time: '10:00 AM',
            location: 'Hill Top',
            type: 'game',
            description: 'Traditional Sankranthi kite competition.'
        }
    ];

    for (const game of games) {
        const { error } = await supabase.from('events').upsert(game);
        if (error) console.error('Error seeding game:', game.name, error.message);
        else console.log('Seeded game:', game.name);
    }

    console.log('Seeding completed!');
}

seed();
