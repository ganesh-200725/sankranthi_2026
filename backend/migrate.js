const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { query } = require('./database');

const USERS_FILE = path.join(__dirname, 'users-data.json');
const EVENTS_FILE = path.join(__dirname, 'game-data.json');
const RANGOLI_FILE = path.join(__dirname, 'rangoli-data.json');
const DANCE_FILE = path.join(__dirname, 'dance-data.json');
const FINANCE_FILE = path.join(__dirname, 'financial-data.json');
const SUGGESTIONS_FILE = path.join(__dirname, 'suggestions-data.json');

async function migrate() {
    console.log('Starting migration to SQLite...');

    // 1. Migrate Users (with Password Hashing)
    if (fs.existsSync(USERS_FILE)) {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            try {
                await query.run(
                    `INSERT OR IGNORE INTO users (id, username, password, role) VALUES (?, ?, ?, ?)`,
                    [user.id || Date.now().toString() + Math.random(), user.username, hashedPassword, user.role]
                );
            } catch (err) {
                console.error(`Failed to migrate user ${user.username}:`, err.message);
            }
        }
        console.log('Users migrated (and hashed).');
    }

    // 2. Migrate Events
    if (fs.existsSync(EVENTS_FILE)) {
        const events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
        for (const event of events) {
            await query.run(
                `INSERT OR IGNORE INTO events (id, name, emoji, date, time, location, participants, description, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [event.id, event.name, event.emoji, event.date, event.time, event.location, event.participants, event.description, event.type]
            );
        }
        console.log('Events migrated.');
    }

    // 3. Migrate Rangoli
    if (fs.existsSync(RANGOLI_FILE)) {
        const entries = JSON.parse(fs.readFileSync(RANGOLI_FILE, 'utf8'));
        for (const entry of entries) {
            await query.run(
                `INSERT OR IGNORE INTO rangoli (id, participantName, participantId, imageUrl, likes, likedBy) VALUES (?, ?, ?, ?, ?, ?)`,
                [entry.id, entry.participantName, entry.participantId, entry.imageUrl, entry.likes || 0, JSON.stringify(entry.likedBy || [])]
            );
        }
        console.log('Rangoli migrated.');
    }

    // 4. Migrate Dances
    if (fs.existsSync(DANCE_FILE)) {
        const teams = JSON.parse(fs.readFileSync(DANCE_FILE, 'utf8'));
        for (const team of teams) {
            await query.run(
                `INSERT OR IGNORE INTO dance_teams (id, name, members, timeSlot) VALUES (?, ?, ?, ?)`,
                [team.id, team.name, JSON.stringify(team.members || []), team.timeSlot]
            );
        }
        console.log('Dances migrated.');
    }

    // 5. Migrate Finance
    if (fs.existsSync(FINANCE_FILE)) {
        const expenses = JSON.parse(fs.readFileSync(FINANCE_FILE, 'utf8'));
        for (const exp of expenses) {
            await query.run(
                `INSERT OR IGNORE INTO expenditures (id, item, amount, date, addedBy) VALUES (?, ?, ?, ?, ?)`,
                [exp.id, exp.item, exp.amount, exp.date, exp.addedBy]
            );
        }
        console.log('Expenditures migrated.');
    }

    // 6. Migrate Suggestions
    if (fs.existsSync(SUGGESTIONS_FILE)) {
        const suggestions = JSON.parse(fs.readFileSync(SUGGESTIONS_FILE, 'utf8'));
        for (const sugg of suggestions) {
            await query.run(
                `INSERT OR IGNORE INTO suggestions (id, text, date) VALUES (?, ?, ?)`,
                [sugg.id || Date.now().toString(), sugg.text, sugg.date]
            );
        }
        console.log('Suggestions migrated.');
    }

    console.log('Migration completed successfully!');
}

if (require.main === module) {
    migrate().catch(console.error);
}

module.exports = migrate;
