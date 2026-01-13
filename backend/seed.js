const { query } = require('./database');

const festivalEvents = [
    // --- JANUARY 14 (BHOGI) ---
    {
        id: 'bhogi-manta',
        name: 'Bhogi Manta',
        emoji: '🔥',
        date: 'January 14, 2026',
        time: '',
        location: 'Main Street Devada',
        participants: 'All Villagers',
        description: 'Traditional Bhogi bonfire to start the festival celebrations.',
        type: 'ceremony'
    },
    {
        id: 'colour-game',
        name: 'Colour Game',
        emoji: '🎨',
        date: 'January 14, 2026',
        time: '',
        location: 'Main Street Devada',
        participants: 'Open for all',
        description: 'Fun-filled colour competition for kids and youth.',
        type: 'game'
    },
    {
        id: 'blast-balloon',
        name: 'Blast the Balloon',
        emoji: '🎈',
        date: 'January 14, 2026',
        time: '',
        location: 'Main Street Devada',
        participants: 'Kids',
        description: 'Exciting balloon bursting competition.',
        type: 'game'
    },
    {
        id: 'carry-balloon',
        name: 'Carry the Balloon',
        emoji: '🏃',
        date: 'January 14, 2026',
        time: '',
        location: 'Main Street Devada',
        participants: 'Couples & Pairs',
        description: 'Balance and coordination game with balloons.',
        type: 'game'
    },
    {
        id: 'housie',
        name: 'Housie',
        emoji: '🔢',
        date: 'January 14, 2026',
        time: '',
        location: 'Main Street Devada',
        participants: 'All Ages',
        description: 'Classic game of luck and numbers for the whole community.',
        type: 'game'
    },
    {
        id: 'bhogi-dances',
        name: 'Dance Performances',
        emoji: '💃',
        date: 'January 14, 2026',
        time: '',
        location: 'Main Stage Devada',
        participants: 'Registered Teams',
        description: 'Evening cultural dances and performances.',
        type: 'performance'
    },

    // --- JANUARY 15 (SANKRANTHI) ---
    {
        id: 'rangoli-competition',
        name: 'Rangoli Competition',
        emoji: '✨',
        date: 'January 15, 2026',
        time: '',
        location: 'Main Street Devada',
        participants: 'Women & Girls',
        description: 'Showcase your artistic skills with traditional Rangoli designs.',
        type: 'game'
    },
    {
        id: 'tug-of-war',
        name: 'Tug of War',
        emoji: '💪',
        date: 'January 15, 2026',
        time: '',
        location: 'School Ground',
        participants: 'Youth & Men Teams',
        description: 'Test your strength in the ultimate tug of war battle.',
        type: 'game'
    },
    {
        id: 'pick-bottle',
        name: 'Pick the Bottle',
        emoji: '🍾',
        date: 'January 15, 2026',
        time: '',
        location: 'Main Street Devada',
        participants: 'Youth',
        description: 'A challenging game of skill and speed.',
        type: 'game'
    },
    {
        id: 'vutti',
        name: 'Vutti (Pot Breaking)',
        emoji: '🍯',
        date: 'January 15, 2026',
        time: '',
        location: 'Village Center',
        participants: 'Youth',
        description: 'Traditional pot-breaking challenge (Utti Kottadam).',
        type: 'game'
    },
    {
        id: 'tasks-game',
        name: 'Tasks Game',
        emoji: '📋',
        date: 'January 15, 2026',
        time: '',
        location: 'Main Street Devada',
        participants: 'Kids & Teens',
        description: 'Multi-stage fun tasks competition.',
        type: 'game'
    },
    {
        id: 'musical-chair',
        name: 'Musical Chair',
        emoji: '🪑',
        date: 'January 15, 2026',
        time: '',
        location: 'Village Center',
        participants: 'Kids & Women',
        description: 'The classic game of musical chairs.',
        type: 'game'
    },
    {
        id: 'singing-perf',
        name: 'Singing Competition',
        emoji: '🎤',
        date: 'January 15, 2026',
        time: '',
        location: 'Main Stage Devada',
        participants: 'Solo & Duet',
        description: 'Showcase your vocal talent on the big stage.',
        type: 'performance'
    },
    {
        id: 'dancing-perf',
        name: 'Grand Dance Finale',
        emoji: '🕺',
        date: 'January 15, 2026',
        time: '',
        location: 'Main Stage Devada',
        participants: 'All Registered Teams',
        description: 'Final round of dance performances and award ceremony.',
        type: 'performance'
    }
];

async function seed() {
    console.log('--- Starting Precise Data Restoration ---');
    try {
        await query.run('DELETE FROM events');
        console.log('Database cleared.');

        for (const event of festivalEvents) {
            await query.run(
                'INSERT INTO events (id, name, emoji, date, time, location, participants, description, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [event.id, event.name, event.emoji, event.date, event.time, event.location, event.participants, event.description, event.type]
            );
            console.log(`Successfully added: ${event.name}`);
        }
        console.log('--- Restoration Complete: All pages synchronized with your plan ---');
    } catch (error) {
        console.error('Data update failed:', error);
    } finally {
        process.exit();
    }
}

seed();
