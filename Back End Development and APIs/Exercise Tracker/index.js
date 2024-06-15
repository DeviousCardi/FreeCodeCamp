require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// In-memory data stores
let users = [];
let exercises = [];

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// API endpoints
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const user = { username, _id: generateId() };
  users.push(user);
  res.json(user);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const user = users.find(u => u._id === _id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const exercise = {
    userId: _id,
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString()
  };
  exercises.push(exercise);
  
  res.json({
    _id: user._id,
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date
  });
});

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const user = users.find(u => u._id === _id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  let logs = exercises.filter(e => e.userId === _id);
  
  if (from) {
    const fromDate = new Date(from);
    logs = logs.filter(e => new Date(e.date) >= fromDate);
  }
  
  if (to) {
    const toDate = new Date(to);
    logs = logs.filter(e => new Date(e.date) <= toDate);
  }
  
  if (limit) {
    logs = logs.slice(0, parseInt(limit));
  }
  
  res.json({
    _id: user._id,
    username: user.username,
    count: logs.length,
    log: logs.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date
    }))
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
