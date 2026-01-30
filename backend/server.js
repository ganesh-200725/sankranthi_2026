const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('./database');
const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = 'sankranthi-secret-2026';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Fallback for legacy simple auth (headers)
    const { username, password } = req.headers;
    if (username === 'hari' && password === '123456') {
      req.user = { username: 'hari', role: 'committee' };
      return next();
    }
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
    const user = await query.get('SELECT * FROM users WHERE username = ?', [username.toLowerCase()]);

    if (!user) {
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
    const users = await query.all('SELECT id, username, role FROM users');
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
    await query.run(
      'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
      [id, username.toLowerCase(), hashedPassword, role]
    );
    res.json({ id, username, role });
  } catch (err) {
    res.status(500).json({ error: 'User already exists or database error' });
  }
});

app.delete('/admin/users/:id', authenticateToken, async (req, res) => {
  if (req.user.username.toLowerCase() !== 'ganesh') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    await query.run('DELETE FROM users WHERE id = ? OR username = ?', [req.params.id, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Expenditures Routes
app.get('/expenditures', async (req, res) => {
  try {
    const list = await query.all('SELECT * FROM expenditures ORDER BY date DESC');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/expenditures', authenticateToken, async (req, res) => {
  const { item, amount, date } = req.body;
  const id = Date.now().toString();
  try {
    await query.run(
      'INSERT INTO expenditures (id, item, amount, date, addedBy) VALUES (?, ?, ?, ?, ?)',
      [id, item, amount, date || new Date().toISOString().split('T')[0], req.user.username]
    );
    const added = await query.get('SELECT * FROM expenditures WHERE id = ?', [id]);
    res.json(added);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/expenditures/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM expenditures WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Suggestions Routes
app.get('/suggestions', async (req, res) => {
  try {
    const list = await query.all('SELECT * FROM suggestions ORDER BY date DESC');
    // Map database fields to frontend fields if necessary
    const formatted = list.map(s => ({
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
    await query.run(
      'INSERT INTO suggestions (id, name, text, date) VALUES (?, ?, ?, ?)',
      [id, name || 'Anonymous', message, date]
    );
    res.json({ id, name, message, date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/suggestions/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM suggestions WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rangoli Routes
app.get('/rangoli', async (req, res) => {
  try {
    const list = await query.all('SELECT * FROM rangoli');
    const formatted = list.map(r => ({
      ...r,
      likedBy: JSON.parse(r.likedBy || '[]')
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
    await query.run(
      'INSERT INTO rangoli (id, participantName, participantId, imageUrl, likes, likedBy) VALUES (?, ?, ?, ?, 0, ?)',
      [id, participantName, participantId, imageUrl, '[]']
    );
    const added = await query.get('SELECT * FROM rangoli WHERE id = ?', [id]);
    res.json({ ...added, likedBy: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/rangoli/:id/like', async (req, res) => {
  const { id } = req.params;
  const { clientId } = req.body;
  if (!clientId) return res.status(400).json({ error: 'Client ID required' });

  try {
    const entry = await query.get('SELECT * FROM rangoli WHERE id = ?', [id]);
    if (!entry) return res.status(404).json({ error: 'Not found' });

    let likedBy = JSON.parse(entry.likedBy || '[]');
    if (likedBy.includes(clientId)) {
      return res.status(400).json({ error: 'Already liked' });
    }

    likedBy.push(clientId);
    const newLikes = (entry.likes || 0) + 1;

    await query.run(
      'UPDATE rangoli SET likes = ?, likedBy = ? WHERE id = ?',
      [newLikes, JSON.stringify(likedBy), id]
    );

    res.json({ success: true, likes: newLikes, likedBy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/rangoli/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM rangoli WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dance Teams Routes
app.get('/dance-teams', async (req, res) => {
  try {
    const list = await query.all('SELECT * FROM dance_teams');
    const formatted = list.map(t => ({
      ...t,
      members: JSON.parse(t.members || '[]')
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
    await query.run(
      'INSERT INTO dance_teams (id, name, members, timeSlot) VALUES (?, ?, ?, ?)',
      [id, name, JSON.stringify(members || []), null]
    );
    const added = await query.get('SELECT * FROM dance_teams WHERE id = ?', [id]);
    res.json({ ...added, members: JSON.parse(added.members) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/dance-teams/:id', authenticateToken, async (req, res) => {
  const { timeSlot } = req.body;
  try {
    await query.run('UPDATE dance_teams SET timeSlot = ? WHERE id = ?', [timeSlot, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/dance-teams/:id', authenticateToken, async (req, res) => {
  try {
    await query.run('DELETE FROM dance_teams WHERE id = ?', [req.params.id]);
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
    const list = await query.all(
      'SELECT targetId, score FROM scores WHERE type = ? AND judgeName = ?',
      [type, judgeName]
    );
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/scores', authenticateToken, async (req, res) => {
  const { type, scores } = req.body;
  const judgeName = req.user.username;

  try {
    for (const item of scores) {
      const existing = await query.get(
        'SELECT * FROM scores WHERE type = ? AND targetId = ? AND judgeName = ?',
        [type, item.targetId, judgeName]
      );

      if (existing) {
        await query.run(
          'UPDATE scores SET score = ? WHERE type = ? AND targetId = ? AND judgeName = ?',
          [item.score, type, item.targetId, judgeName]
        );
      } else {
        await query.run(
          'INSERT INTO scores (type, targetId, judgeName, score) VALUES (?, ?, ?, ?)',
          [type, item.targetId, judgeName, item.score]
        );
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
    const events = await query.all('SELECT * FROM events');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/games', authenticateToken, async (req, res) => {
  const { name, emoji, date, time, location, participants, description, type } = req.body;
  const id = Date.now().toString();
  try {
    await query.run(
      'INSERT INTO events (id, name, emoji, date, time, location, participants, description, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, emoji, date || 'January 14, 2026', time, location, participants, description, type || 'game']
    );
    const newEvent = await query.get('SELECT * FROM events WHERE id = ?', [id]);
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/games/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updates), id];
  try {
    await query.run(`UPDATE events SET ${fields} WHERE id = ?`, values);
    const updated = await query.get('SELECT * FROM events WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/games/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query.run('DELETE FROM events WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
