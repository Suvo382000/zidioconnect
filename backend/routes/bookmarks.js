const express = require('express');
const { queryGet, queryAll, queryRun } = require('../database/init');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Toggle bookmark
router.post('/:jobId', auth, authorize('student'), (req, res) => {
  try {
    const existing = queryGet('SELECT id FROM bookmarks WHERE user_id = ? AND job_id = ?', [req.user.id, req.params.jobId]);
    if (existing) {
      queryRun('DELETE FROM bookmarks WHERE id = ?', [existing.id]);
      res.json({ message: 'Bookmark removed.', bookmarked: false });
    } else {
      queryRun('INSERT INTO bookmarks (user_id, job_id) VALUES (?, ?)', [req.user.id, req.params.jobId]);
      res.json({ message: 'Job bookmarked.', bookmarked: true });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user's bookmarks
router.get('/', auth, authorize('student'), (req, res) => {
  try {
    const bookmarks = queryAll(`
      SELECT b.*, j.title, j.type, j.location, j.work_mode, j.salary_min, j.salary_max,
             j.created_at as job_posted, rp.company_name, rp.company_logo
      FROM bookmarks b
      JOIN jobs j ON b.job_id = j.id
      JOIN users u ON j.recruiter_id = u.id
      LEFT JOIN recruiter_profiles rp ON u.id = rp.user_id
      WHERE b.user_id = ? AND j.is_active = 1
      ORDER BY b.created_at DESC
    `, [req.user.id]);
    res.json(bookmarks);
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Check if bookmarked
router.get('/check/:jobId', auth, (req, res) => {
  try {
    const existing = queryGet('SELECT id FROM bookmarks WHERE user_id = ? AND job_id = ?', [req.user.id, req.params.jobId]);
    res.json({ bookmarked: !!existing });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
