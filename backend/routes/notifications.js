const express = require('express');
const { queryGet, queryAll, queryRun } = require('../database/init');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user notifications
router.get('/', auth, (req, res) => {
  try {
    const notifications = queryAll('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [req.user.id]);
    const unreadResult = queryGet('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [req.user.id]);
    res.json({ notifications, unread_count: unreadResult ? unreadResult.count : 0 });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Mark as read
router.put('/:id/read', auth, (req, res) => {
  try {
    queryRun('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Mark all as read
router.put('/read-all', auth, (req, res) => {
  try {
    queryRun('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
