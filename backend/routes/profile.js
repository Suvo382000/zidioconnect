const express = require('express');
const multer = require('multer');
const path = require('path');
const { queryGet, queryRun } = require('../database/init');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowedTypes.includes(ext));
  }
});

// Update student profile
router.put('/student', auth, authorize('student'), (req, res) => {
  try {
    const { headline, bio, skills, education, experience, linkedin, github, portfolio, location, name, phone } = req.body;

    // Ensure profile row exists — create if missing
    let current = queryGet('SELECT * FROM student_profiles WHERE user_id = ?', [req.user.id]);
    if (!current) {
      queryRun('INSERT INTO student_profiles (user_id) VALUES (?)', [req.user.id]);
      current = queryGet('SELECT * FROM student_profiles WHERE user_id = ?', [req.user.id]);
    }

    // Use submitted values directly — empty string means user cleared the field
    const finalHeadline = headline !== undefined ? headline : (current ? current.headline : null);
    const finalBio = bio !== undefined ? bio : (current ? current.bio : null);
    const finalSkills = skills !== undefined ? skills : (current ? current.skills : null);
    const finalEducation = education !== undefined ? education : (current ? current.education : null);
    const finalExperience = experience !== undefined ? experience : (current ? current.experience : null);
    const finalLinkedin = linkedin !== undefined ? linkedin : (current ? current.linkedin : null);
    const finalGithub = github !== undefined ? github : (current ? current.github : null);
    const finalPortfolio = portfolio !== undefined ? portfolio : (current ? current.portfolio : null);
    const finalLocation = location !== undefined ? location : (current ? current.location : null);

    queryRun(`UPDATE student_profiles SET headline=?, bio=?, skills=?, education=?, experience=?, linkedin=?, github=?, portfolio=?, location=?, updated_at=CURRENT_TIMESTAMP WHERE user_id=?`,
      [finalHeadline, finalBio, finalSkills, finalEducation, finalExperience, finalLinkedin, finalGithub, finalPortfolio, finalLocation, req.user.id]);

    if (name) {
      queryRun('UPDATE users SET name=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [name, req.user.id]);
    }
    if (phone) {
      queryRun('UPDATE users SET phone=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [phone, req.user.id]);
    }

    const profile = queryGet('SELECT * FROM student_profiles WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Profile updated.', profile });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Upload resume
router.post('/resume', auth, authorize('student'), upload.single('resume'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
    const resumePath = '/uploads/' + req.file.filename;
    queryRun('UPDATE student_profiles SET resume_path=?, updated_at=CURRENT_TIMESTAMP WHERE user_id=?', [resumePath, req.user.id]);
    res.json({ message: 'Resume uploaded.', path: resumePath });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update recruiter profile
router.put('/recruiter', auth, authorize('recruiter'), (req, res) => {
  try {
    const { company_name, company_website, company_description, industry, company_size, location, name, phone } = req.body;

    // Ensure profile row exists — create if missing
    const current = queryGet('SELECT * FROM recruiter_profiles WHERE user_id = ?', [req.user.id]);

    if (!current) {
      queryRun('INSERT INTO recruiter_profiles (user_id, company_name) VALUES (?, ?)', [req.user.id, company_name || 'My Company']);
    }

    // Use submitted values directly — empty string means user cleared the field
    const finalCompanyName = company_name !== undefined ? (company_name || (current ? current.company_name : 'My Company')) : (current ? current.company_name : 'My Company');
    const finalWebsite = company_website !== undefined ? company_website : (current ? current.company_website : null);
    const finalDesc = company_description !== undefined ? company_description : (current ? current.company_description : null);
    const finalIndustry = industry !== undefined ? industry : (current ? current.industry : null);
    const finalSize = company_size !== undefined ? company_size : (current ? current.company_size : null);
    const finalLocation = location !== undefined ? location : (current ? current.location : null);

    queryRun(`UPDATE recruiter_profiles SET company_name=?, company_website=?, company_description=?, industry=?, company_size=?, location=?, updated_at=CURRENT_TIMESTAMP WHERE user_id=?`,
      [finalCompanyName, finalWebsite, finalDesc, finalIndustry, finalSize, finalLocation, req.user.id]);

    if (name) {
      queryRun('UPDATE users SET name=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [name, req.user.id]);
    }
    if (phone) {
      queryRun('UPDATE users SET phone=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [phone, req.user.id]);
    }

    const profile = queryGet('SELECT * FROM recruiter_profiles WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Profile updated.', profile });
  } catch (error) {
    console.error('Update recruiter profile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Upload avatar
router.post('/avatar', auth, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
    const avatarPath = '/uploads/' + req.file.filename;
    queryRun('UPDATE users SET avatar=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [avatarPath, req.user.id]);
    res.json({ message: 'Avatar uploaded.', path: avatarPath });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
