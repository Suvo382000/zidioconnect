const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('../../database/init');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set environment variables
process.env.JWT_SECRET = process.env.JWT_SECRET || 'zidioconnect_super_secure_key_2024';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

let dbInitialized = false;

// Initialize database before handling requests
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
  next();
});

// Routes
app.use('/api/auth', require('../../routes/auth'));
app.use('/api/jobs', require('../../routes/jobs'));
app.use('/api/applications', require('../../routes/applications'));
app.use('/api/profile', require('../../routes/profile'));
app.use('/api/bookmarks', require('../../routes/bookmarks'));
app.use('/api/notifications', require('../../routes/notifications'));
app.use('/api/admin', require('../../routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ZIDIOConnect API is running on Netlify.' });
});

// Catch all
app.get('/', (req, res) => {
  res.json({ message: 'ZIDIOConnect API' });
});

module.exports.handler = serverless(app);
