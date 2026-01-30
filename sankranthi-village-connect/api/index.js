const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'sankranthi-secret-2026';

// Support both VITE_ and standard env names for convenience
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Missing Supabase URL or Key in Environment Variables");
}

const supabase = createClient(supabaseUrl || "", supabaseKey || "");


app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token expired or invalid' });
        req.user = user;
        next();
    });
};

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/login', async (req, res) => {

    const { username, password } = req.body;
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username.toLowerCase())
            .single();

        if (error || !user) return res.status(401).json({ success: false, error: 'Invalid username' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ success: false, error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, user: { username: user.username, role: user.role }, token });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
    if (req.user.username.toLowerCase() !== 'ganesh') return res.status(403).json({ error: 'Forbidden' });
    const { data, error } = await supabase.from('users').select('id, username, role');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/admin/users', authenticateToken, async (req, res) => {
    if (req.user.username.toLowerCase() !== 'ganesh') return res.status(403).json({ error: 'Forbidden' });
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from('users').insert([{ id: Date.now().toString(), username: username.toLowerCase(), password: hashedPassword, role }]).select().single();
    if (error) return res.status(400).json({ error: 'User exists or DB error' });
    res.json(data);
});

app.get('/api/expenditures', async (req, res) => {
    const { data, error } = await supabase.from('expenditures').select('*').order('date', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/expenditures', authenticateToken, async (req, res) => {
    const { item, amount, date } = req.body;
    const { data, error } = await supabase.from('expenditures').insert([{ id: Date.now().toString(), item, amount, date: date || new Date().toISOString().split('T')[0], addedBy: req.user.username }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/suggestions', async (req, res) => {
    const { data, error } = await supabase.from('suggestions').select('*').order('date', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data.map(s => ({ id: s.id, name: s.name || 'Anonymous', message: s.text, date: s.date })));
});

app.post('/api/suggestions', async (req, res) => {
    const { name, message } = req.body;
    const date = new Date().toLocaleString();
    const { error } = await supabase.from('suggestions').insert([{ id: Date.now().toString(), name: name || 'Anonymous', text: message, date }]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, date });
});

app.get('/api/rangoli', async (req, res) => {
    const { data, error } = await supabase.from('rangoli').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data.map(r => ({ ...r, likedBy: typeof r.likedBy === 'string' ? JSON.parse(r.likedBy || '[]') : (r.likedBy || []) })));
});

app.post('/api/rangoli/:id/like', async (req, res) => {
    const { clientId } = req.body;
    const { data: entry } = await supabase.from('rangoli').select('*').eq('id', req.params.id).single();
    if (!entry) return res.status(404).json({ error: 'Not found' });
    let likedBy = typeof entry.likedBy === 'string' ? JSON.parse(entry.likedBy || '[]') : (entry.likedBy || []);
    if (likedBy.includes(clientId)) return res.status(400).json({ error: 'Already liked' });
    likedBy.push(clientId);
    const { error } = await supabase.from('rangoli').update({ likes: (entry.likes || 0) + 1, likedBy: JSON.stringify(likedBy) }).eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, likes: (entry.likes || 0) + 1, likedBy });
});

app.get('/api/dance-teams', async (req, res) => {
    const { data, error } = await supabase.from('dance_teams').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data.map(t => ({ ...t, members: typeof t.members === 'string' ? JSON.parse(t.members || '[]') : (t.members || []) })));
});

app.get('/api/games', async (req, res) => {
    const { data, error } = await supabase.from('events').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/games', authenticateToken, async (req, res) => {
    const { name, emoji, date, time, location, participants, description, type } = req.body;
    const { data, error } = await supabase.from('events').insert([{ id: Date.now().toString(), name, emoji, date: date || 'January 14, 2026', time, location, participants, description, type: type || 'game' }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = app;
