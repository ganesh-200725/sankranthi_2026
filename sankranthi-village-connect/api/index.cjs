const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Defensive environment variable loading
const getSupabaseConfig = () => {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const jwtSecret = process.env.JWT_SECRET || 'sankranthi-secret-2026';
    return { url, key, jwtSecret };
};

// Health check
app.get('/api/health', (req, res) => {
    const { url, key } = getSupabaseConfig();
    res.json({
        status: 'ok',
        supabaseConfigured: !!(url && key),
        timestamp: new Date().toISOString()
    });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const { url, key, jwtSecret } = getSupabaseConfig();

    if (!url || !key) {
        return res.status(500).json({ error: 'Database configuration missing on server.' });
    }

    try {
        const supabase = createClient(url, key);
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username.toLowerCase())
            .single();

        if (error || !user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            user: { username: user.username, role: user.role },
            token
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Server error during login', message: err.message });
    }
});

app.get('/api/games', async (req, res) => {
    const { url, key } = getSupabaseConfig();
    if (!url || !key) return res.status(500).json({ error: 'Config missing' });

    try {
        const supabase = createClient(url, key);
        const { data, error } = await supabase.from('events').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fallback for all other /api routes
app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

module.exports = app;
