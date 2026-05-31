const express = require('express');
const { queryGet, queryAll, queryRun } = require('../database/init');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', auth, authorize('admin'), (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT id, name, email, role, phone, is_active, created_at FROM users WHERE 1=1`;
    const params = [];

    if (role) { query += ` AND role = ?`; params.push(role); }
    if (search) { query += ` AND (name LIKE ? OR email LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const users = queryAll(query, params);

    let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
    const countParams = [];
    if (role) { countQuery += ` AND role = ?`; countParams.push(role); }
    if (search) { countQuery += ` AND (name LIKE ? OR email LIKE ?)`; countParams.push(`%${search}%`, `%${search}%`); }

    const countResult = queryGet(countQuery, countParams);
    const total = countResult ? countResult.total : 0;

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Toggle user status
router.put('/users/:id/toggle-status', auth, authorize('admin'), (req, res) => {
  try {
    const user = queryGet('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot block admin.' });

    const newStatus = user.is_active ? 0 : 1;
    queryRun('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, req.params.id]);
    res.json({ message: `User ${newStatus ? 'unblocked' : 'blocked'}.`, is_active: newStatus });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get analytics
router.get('/analytics', auth, authorize('admin'), (req, res) => {
  try {
    const totalUsers = queryGet('SELECT COUNT(*) as count FROM users')?.count || 0;
    const totalStudents = queryGet("SELECT COUNT(*) as count FROM users WHERE role = 'student'")?.count || 0;
    const totalRecruiters = queryGet("SELECT COUNT(*) as count FROM users WHERE role = 'recruiter'")?.count || 0;
    const totalJobs = queryGet('SELECT COUNT(*) as count FROM jobs')?.count || 0;
    const activeJobs = queryGet('SELECT COUNT(*) as count FROM jobs WHERE is_active = 1')?.count || 0;
    const totalApplications = queryGet('SELECT COUNT(*) as count FROM applications')?.count || 0;
    const pendingApplications = queryGet("SELECT COUNT(*) as count FROM applications WHERE status = 'pending'")?.count || 0;

    const recentJobs = queryAll(`
      SELECT j.title, j.type, j.created_at, rp.company_name 
      FROM jobs j LEFT JOIN recruiter_profiles rp ON j.recruiter_id = rp.user_id
      ORDER BY j.created_at DESC LIMIT 5
    `);

    const recentUsers = queryAll('SELECT name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5');

    res.json({
      stats: { totalUsers, totalStudents, totalRecruiters, totalJobs, activeJobs, totalApplications, pendingApplications },
      recentJobs,
      recentUsers
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all jobs (admin)
router.get('/jobs', auth, authorize('admin'), (req, res) => {
  try {
    const jobs = queryAll(`
      SELECT j.id, j.title, j.description, j.type as job_type, j.category, j.location, j.work_mode,
             j.salary_min, j.salary_max, j.skills_required, j.experience_level, j.deadline,
             j.is_active, j.created_at, j.recruiter_id,
             u.name as recruiter_name, rp.company_name,
             (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as application_count
      FROM jobs j JOIN users u ON j.recruiter_id = u.id
      LEFT JOIN recruiter_profiles rp ON u.id = rp.user_id
      ORDER BY j.created_at DESC
    `);
    res.json(jobs);
  } catch (error) {
    console.error('Admin get jobs error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete job (admin)
router.delete('/jobs/:id', auth, authorize('admin'), (req, res) => {
  try {
    queryRun('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
