-- Create Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Events Table
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    emoji TEXT,
    date TEXT,
    time TEXT,
    location TEXT,
    participants TEXT,
    description TEXT,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Rangoli Table
CREATE TABLE rangoli (
    id TEXT PRIMARY KEY,
    participantName TEXT NOT NULL,
    participantId TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    likedBy TEXT, -- JSON string or JSONB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Dance Teams Table
CREATE TABLE dance_teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    members TEXT, -- JSON string or JSONB
    timeSlot TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Expenditures Table
CREATE TABLE expenditures (
    id TEXT PRIMARY KEY,
    item TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    addedBy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Suggestions Table
CREATE TABLE suggestions (
    id TEXT PRIMARY KEY,
    name TEXT,
    text TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Scores Table
CREATE TABLE scores (
    type TEXT NOT NULL,
    targetId TEXT NOT NULL,
    judgeName TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (type, targetId, judgeName)
);

-- Note: Ensure RLS is disabled or appropriate policies are created for the anon key.
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE rangoli DISABLE ROW LEVEL SECURITY;
ALTER TABLE dance_teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenditures DISABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions DISABLE ROW LEVEL SECURITY;
ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
