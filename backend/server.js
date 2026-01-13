const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Hardcoded users (for demo)
const users = [
  { username: 'committee1', password: 'sankranthi2026', role: 'committee' },
  { username: 'finance', password: 'finance2026', role: 'financial_manager' },
  { username: 'ganesh', password: '123456', role: 'financial_manager' }, // Added financial officer
  { username: 'events', password: 'events2026', role: 'event_manager' },
  { username: 'photos', password: 'photos2026', role: 'photo_head' },
  { username: 'judge1', password: 'judge2026', role: 'judge' },
  { username: 'judge2', password: 'judge2026', role: 'judge' },
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid username or password' });
  }
  res.json({ success: true, user: { username: user.username, role: user.role } });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
