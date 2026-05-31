const express = require('express');
const { queryGet, queryAll, queryRun } = require('../database/init');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply for a job (student only)
router.post('/', auth, authorize('student'), (req, res) => {
  try {
    const { job_id, cover_letter } = req.body;
    if (!job_id) return res.status(400).json({ message: 'Job ID is required.' });

    const job = queryGet('SELECT * FROM jobs WHERE id = ? AND is_active = 1', [job_id]);
    if (!job) return res.status(404).json({ message: 'Job not found or no longer active.' });

    const existing = queryGet('SELECT id FROM applications WHERE job_id = ? AND student_id = ?', [job_id, req.user.id]);
    if (existing) return res.status(400).json({ message: 'You have already applied for this job.' });

    const profile = queryGet('SELECT resume_path FROM student_profiles WHERE user_id = ?', [req.user.id]);

    const result = queryRun(
      'INSERT INTO applications (job_id, student_id, cover_letter, resume_path) VALUES (?, ?, ?, ?)',
      [job_id, req.user.id, cover_letter || null, profile?.resume_path || null]
    );

    const student = queryGet('SELECT name FROM users WHERE id = ?', [req.user.id]);
    queryRun(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [job.recruiter_id, 'New Application', `${student.name} applied for "${job.title}"`, 'application']
    );

    res.status(201).json({ message: 'Application submitted successfully.', id: result.lastInsertRowid });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get student's applications
router.get('/my-applications', auth, authorize('student'), (req, res) => {
  try {
    const applications = queryAll(`
      SELECT a.*, j.title as job_title, j.type as job_type, j.location as job_location,
             rp.company_name, rp.company_logo
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON j.recruiter_id = u.id
      LEFT JOIN recruiter_profiles rp ON u.id = rp.user_id
      WHERE a.student_id = ?
      ORDER BY a.applied_at DESC
    `, [req.user.id]);
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get applications for a job (recruiter only)
router.get('/job/:jobId', auth, authorize('recruiter'), (req, res) => {
  try {
    const job = queryGet('SELECT * FROM jobs WHERE id = ? AND recruiter_id = ?', [req.params.jobId, req.user.id]);
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized.' });

    const applications = queryAll(`
      SELECT a.*, u.name as student_name, u.email as student_email, u.avatar as student_avatar,
             sp.headline, sp.skills, sp.resume_path as profile_resume
      FROM applications a
      JOIN users u ON a.student_id = u.id
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      WHERE a.job_id = ?
      ORDER BY a.applied_at DESC
    `, [req.params.jobId]);
    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update application status (recruiter only)
router.put('/:id/status', auth, authorize('recruiter'), (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'shortlisted', 'rejected', 'accepted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const application = queryGet(`
      SELECT a.*, j.recruiter_id, j.title as job_title FROM applications a
      JOIN jobs j ON a.job_id = j.id WHERE a.id = ?
    `, [req.params.id]);

    if (!application || application.recruiter_id !== req.user.id) {
      return res.status(404).json({ message: 'Application not found or unauthorized.' });
    }

    queryRun('UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, req.params.id]);

    const statusMessages = {
      shortlisted: `Your application for "${application.job_title}" has been shortlisted!`,
      rejected: `Your application for "${application.job_title}" was not selected.`,
      accepted: `Congratulations! Your application for "${application.job_title}" has been accepted!`
    };

    if (statusMessages[status]) {
      queryRun(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [application.student_id, 'Application Update', statusMessages[status], 'status_update']
      );
    }

    res.json({ message: `Application ${status}.` });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
