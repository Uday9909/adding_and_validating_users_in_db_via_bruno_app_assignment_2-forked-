const express = require('express');
const { resolve } = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3010;

// Middleware
app.use(express.static('static'));
app.use(bodyParser.json());

// Mock user database
const users = [
  {
    email: 'uday@example.com',
    password: '$2b$10$N9qo8uLOickgx2ZMRZoMy.MQRjQ3J1M8t0m3j/5JYv5d3OQ9Q1qW2' // hashed 'password123'
  }
];

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare passwords
  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Serve index page
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
