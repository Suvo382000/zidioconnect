const express = require('express');
const { queryGet, queryAll, queryRun } = require('../database/init');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (public with filters)
router.get('/', (req, res) => {
  try {
    const { search, type, category, location, work_mode, experience_level, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT j.*, u.name as recruiter_name, rp.company_name, rp.company_logo 
                 FROM jobs j 
                 JOIN users u ON j.recruiter_id = u.id 
                 LEFT JOIN recruiter_profiles rp ON u.id = rp.user_id 
                 WHERE j.is_active = 1`;
    const params = [];

    if (search) {
      query += ` AND (j.title LIKE ? OR j.description LIKE ? OR j.skills_required LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (type) { query += ` AND j.type = ?`; params.push(type); }
    if (category) { query += ` AND j.category = ?`; params.push(category); }
    if (location) { query += ` AND j.location LIKE ?`; params.push(`%${location}%`); }
    if (work_mode) { query += ` AND j.work_mode = ?`; params.push(work_mode); }
    if (experience_level) { query += ` AND j.experience_level = ?`; params.push(experience_level); }

    query += ` ORDER BY j.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const jobs = queryAll(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM jobs j WHERE j.is_active = 1`;
    const countParams = [];
    if (search) { countQuery += ` AND (j.title LIKE ? OR j.description LIKE ? OR j.skills_required LIKE ?)`; countParams.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    if (type) { countQuery += ` AND j.type = ?`; countParams.push(type); }
    if (category) { countQuery += ` AND j.category = ?`; countParams.push(category); }
    if (work_mode) { countQuery += ` AND j.work_mode = ?`; countParams.push(work_mode); }
    if (experience_level) { countQuery += ` AND j.experience_level = ?`; countParams.push(experience_level); }

    const countResult = queryGet(countQuery, countParams);
    const total = countResult ? countResult.total : 0;

    res.json({
      jobs,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single job
router.get('/:id', (req, res) => {
  try {
    const job = queryGet(`
      SELECT j.*, u.name as recruiter_name, rp.company_name, rp.company_logo, rp.company_website, rp.company_description
      FROM jobs j JOIN users u ON j.recruiter_id = u.id 
      LEFT JOIN recruiter_profiles rp ON u.id = rp.user_id WHERE j.id = ?
    `, [req.params.id]);

    if (!job) return res.status(404).json({ message: 'Job not found.' });

    const countResult = queryGet('SELECT COUNT(*) as count FROM applications WHERE job_id = ?', [job.id]);
    job.application_count = countResult ? countResult.count : 0;

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create job (recruiter only)
router.post('/', auth, authorize('recruiter'), (req, res) => {
  try {
    const { title, description, type, category, location, work_mode, salary_min, salary_max, skills_required, experience_level, deadline } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Title, description, and type are required.' });
    }

    const result = queryRun(`
      INSERT INTO jobs (recruiter_id, title, description, type, category, location, work_mode, salary_min, salary_max, skills_required, experience_level, deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, title, description, type, category || null, location || null, work_mode || null, salary_min || null, salary_max || null, skills_required || null, experience_level || null, deadline || null]);

    const job = queryGet('SELECT * FROM jobs WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ message: 'Job posted successfully.', job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update job
router.put('/:id', auth, authorize('recruiter'), (req, res) => {
  try {
    const job = queryGet('SELECT * FROM jobs WHERE id = ? AND recruiter_id = ?', [req.params.id, req.user.id]);
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized.' });

    const { title, description, type, category, location, work_mode, salary_min, salary_max, skills_required, experience_level, deadline, is_active } = req.body;

    queryRun(`UPDATE jobs SET title=?, description=?, type=?, category=?, location=?, work_mode=?, salary_min=?, salary_max=?, skills_required=?, experience_level=?, deadline=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [title||job.title, description||job.description, type||job.type, category||job.category, location||job.location, work_mode||job.work_mode, salary_min??job.salary_min, salary_max??job.salary_max, skills_required||job.skills_required, experience_level||job.experience_level, deadline||job.deadline, is_active??job.is_active, req.params.id]);

    const updated = queryGet('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job updated.', job: updated });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete job
router.delete('/:id', auth, authorize('recruiter', 'admin'), (req, res) => {
  try {
    const job = queryGet('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (req.user.role === 'recruiter' && job.recruiter_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
    queryRun('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job deleted.' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get recruiter's jobs
router.get('/recruiter/my-jobs', auth, authorize('recruiter'), (req, res) => {
  try {
    const jobs = queryAll(`
      SELECT j.*, (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as application_count
      FROM jobs j WHERE j.recruiter_id = ? ORDER BY j.created_at DESC
    `, [req.user.id]);
    res.json(jobs);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
