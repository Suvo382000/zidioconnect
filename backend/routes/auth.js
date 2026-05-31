const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryGet, queryAll, queryRun } = require('../database/init');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!['student', 'recruiter'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const existingUser = queryGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = queryRun(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone || null]
    );

    if (role === 'student') {
      queryRun('INSERT INTO student_profiles (user_id) VALUES (?)', [result.lastInsertRowid]);
    } else if (role === 'recruiter') {
      queryRun('INSERT INTO recruiter_profiles (user_id, company_name) VALUES (?, ?)', [result.lastInsertRowid, 'My Company']);
    }

    const token = jwt.sign(
      { id: result.lastInsertRowid, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: result.lastInsertRowid, name, email, role }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = queryGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is blocked. Contact admin.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get current user
router.get('/me', auth, (req, res) => {
  try {
    const user = queryGet('SELECT id, name, email, role, phone, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = queryGet('SELECT * FROM student_profiles WHERE user_id = ?', [user.id]);
    } else if (user.role === 'recruiter') {
      profile = queryGet('SELECT * FROM recruiter_profiles WHERE user_id = ?', [user.id]);
    }

    res.json({ user, profile });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
