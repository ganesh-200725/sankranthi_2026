require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sankranthi-secret-2026';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token expired or invalid' });
    req.user = user;
    next();
  });
};

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: { username: user.username, role: user.role },
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin User Management
app.get('/admin/users', authenticateToken, async (req, res) => {
  if (req.user.username.toLowerCase() !== 'ganesh') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, role');

    if (error) throw error;
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/users', authenticateToken, async (req, res) => {
  if (req.user.username.toLowerCase() !== 'ganesh') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    const { data, error } = await supabase
      .from('users')
      .insert([{ id, username: username.toLowerCase(), password: hashedPassword, role }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'User already exists or database error' });
  }
});

app.delete('/admin/users/:id', authenticateToken, async (req, res) => {
  if (req.user.username.toLowerCase() !== 'ganesh') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .or(`id.eq.${req.params.id},username.eq.${req.params.id}`);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Expenditures Routes
app.get('/expenditures', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenditures')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/expenditures', authenticateToken, async (req, res) => {
  const { item, amount, date } = req.body;
  const id = Date.now().toString();
  try {
    const { data, error } = await supabase
      .from('expenditures')
      .insert([{
        id,
        item,
        amount,
        date: date || new Date().toISOString().split('T')[0],
        addedBy: req.user.username
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/expenditures/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('expenditures')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Suggestions Routes
app.get('/suggestions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    const formatted = data.map(s => ({
      id: s.id,
      name: s.name || 'Anonymous',
      message: s.text,
      date: s.date
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/suggestions', async (req, res) => {
  const { name, message } = req.body;
  const id = Date.now().toString();
  const date = new Date().toLocaleString();
  try {
    const { error } = await supabase
      .from('suggestions')
      .insert([{ id, name: name || 'Anonymous', text: message, date }]);

    if (error) throw error;
    res.json({ id, name, message, date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rangoli Routes
app.get('/rangoli', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rangoli')
      .select('*');

    if (error) throw error;

    const formatted = data.map(r => ({
      ...r,
      likedBy: typeof r.likedBy === 'string' ? JSON.parse(r.likedBy || '[]') : (r.likedBy || [])
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/rangoli', authenticateToken, async (req, res) => {
  const { participantName, participantId, imageUrl } = req.body;
  const id = Date.now().toString();
  try {
    const { data, error } = await supabase
      .from('rangoli')
      .insert([{
        id,
        participantName,
        participantId,
        imageUrl,
        likes: 0,
        likedBy: '[]'
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ ...data, likedBy: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/rangoli/:id/like', async (req, res) => {
  const { id } = req.params;
  const { clientId } = req.body;
  if (!clientId) return res.status(400).json({ error: 'Client ID required' });

  try {
    const { data: entry, error: fetchError } = await supabase
      .from('rangoli')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !entry) return res.status(404).json({ error: 'Not found' });

    let likedBy = typeof entry.likedBy === 'string' ? JSON.parse(entry.likedBy || '[]') : (entry.likedBy || []);
    if (likedBy.includes(clientId)) {
      return res.status(400).json({ error: 'Already liked' });
    }

    likedBy.push(clientId);
    const newLikes = (entry.likes || 0) + 1;

    const { error: updateError } = await supabase
      .from('rangoli')
      .update({ likes: newLikes, likedBy: JSON.stringify(likedBy) })
      .eq('id', id);

    if (updateError) throw updateError;

    res.json({ success: true, likes: newLikes, likedBy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/rangoli/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('rangoli')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dance Teams Routes
app.get('/dance-teams', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dance_teams')
      .select('*');

    if (error) throw error;

    const formatted = data.map(t => ({
      ...t,
      members: typeof t.members === 'string' ? JSON.parse(t.members || '[]') : (t.members || [])
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/dance-teams', async (req, res) => {
  const { name, members } = req.body;
  const id = Date.now().toString();
  try {
    const { data, error } = await supabase
      .from('dance_teams')
      .insert([{ id, name, members: JSON.stringify(members || []), timeSlot: null }])
      .select()
      .single();

    if (error) throw error;
    res.json({ ...data, members: typeof data.members === 'string' ? JSON.parse(data.members) : data.members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/dance-teams/:id', authenticateToken, async (req, res) => {
  const { timeSlot } = req.body;
  try {
    const { error } = await supabase
      .from('dance_teams')
      .update({ timeSlot })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/dance-teams/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('dance_teams')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Scores Routes
app.get('/scores/:type', authenticateToken, async (req, res) => {
  const { type } = req.params;
  const judgeName = req.user.username;
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('targetId, score')
      .eq('type', type)
      .eq('judgeName', judgeName);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/scores', authenticateToken, async (req, res) => {
  const { type, scores } = req.body;
  const judgeName = req.user.username;

  try {
    for (const item of scores) {
      const { data: existing } = await supabase
        .from('scores')
        .select('*')
        .eq('type', type)
        .eq('targetId', item.targetId)
        .eq('judgeName', judgeName)
        .single();

      if (existing) {
        await supabase
          .from('scores')
          .update({ score: item.score })
          .eq('type', type)
          .eq('targetId', item.targetId)
          .eq('judgeName', judgeName);
      } else {
        await supabase
          .from('scores')
          .insert([{ type, targetId: item.targetId, judgeName, score: item.score }]);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Games/Events Routes
app.get('/games', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/games', authenticateToken, async (req, res) => {
  const { name, emoji, date, time, location, participants, description, type } = req.body;
  const id = Date.now().toString();
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        id,
        name,
        emoji,
        date: date || 'January 14, 2026',
        time,
        location,
        participants,
        description,
        type: type || 'game'
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/games/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/games/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT} with Supabase`);
});
