const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'festival.db');

// Connect to the database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Initialize tables
db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )`);

    // Events/Schedule Table
    db.run(`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    emoji TEXT,
    date TEXT,
    time TEXT,
    location TEXT,
    participants TEXT,
    description TEXT,
    type TEXT
  )`);

    // Rangoli Table
    db.run(`CREATE TABLE IF NOT EXISTS rangoli (
    id TEXT PRIMARY KEY,
    participantName TEXT NOT NULL,
    participantId TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    likedBy TEXT -- JSON string of clientIds
  )`);

    // Dance Teams Table
    db.run(`CREATE TABLE IF NOT EXISTS dance_teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    members TEXT, -- JSON string of members
    timeSlot TEXT
  )`);

    // Expenditures Table
    db.run(`CREATE TABLE IF NOT EXISTS expenditures (
    id TEXT PRIMARY KEY,
    item TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    addedBy TEXT
  )`);

    // Suggestions Table
    db.run(`CREATE TABLE IF NOT EXISTS suggestions (
    id TEXT PRIMARY KEY,
    name TEXT,
    text TEXT NOT NULL,
    date TEXT NOT NULL
  )`);

    // Scores Table
    db.run(`CREATE TABLE IF NOT EXISTS scores (
    type TEXT NOT NULL, -- 'rangoli' or 'dance'
    targetId TEXT NOT NULL,
    judgeName TEXT NOT NULL,
    score INTEGER NOT NULL,
    PRIMARY KEY (type, targetId, judgeName)
  )`);
});

// Helper to run queries as promises
const query = {
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }
};

module.exports = { db, query };
