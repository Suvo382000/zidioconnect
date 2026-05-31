# ZIDIOConnect - Complete Deployment Guide

## Step 1: Install Backend Dependencies

Open Command Prompt or PowerShell and run:

```bash
cd "d:\job portal\backend"
npm install
```

Wait for all packages to install (should take 1-2 minutes).

---

## Step 2: Start the Backend Server

In the same terminal:

```bash
npm start
```

You should see:
```
Database initialized successfully.
🚀 ZIDIOConnect Backend running on http://localhost:5000
📋 API Health: http://localhost:5000/api/health
```

**IMPORTANT:** Keep this terminal window open. Don't close it.

---

## Step 3: Open the Frontend

**Option A - Simple (Double-click):**
1. Navigate to `d:\job portal\frontend\`
2. Double-click `index.html`

**Option B - Live Server (Recommended):**
1. Open VS Code
2. Right-click `frontend/index.html`
3. Select "Open with Live Server"

---

## Step 4: Test the Application

### Default Admin Login:
- Email: `admin@zidioconnect.com`
- Password: `admin123`

### Create Test Accounts:
1. Click **Sign Up**
2. Register as **Recruiter** (use any email like `recruiter@test.com`)
3. Logout and register as **Student** (use different email like `student@test.com`)

---

## Step 5: Test All Features

### As Recruiter:
1. Login → Dashboard → Profile
2. Fill in Company Name: "Test Company"
3. Fill in Company Description: "Test description"
4. Click **Save Profile**
5. Refresh page - data should persist
6. Go to **Post Job** → Fill form → Submit
7. Go to **My Jobs** → Should see your posted job

### As Student:
1. Login → Dashboard → Profile
2. Fill in Headline: "Computer Science Student"
3. Fill in Skills: "JavaScript, Python, React"
4. Click **Save Profile**
5. Scroll down to **Resume Upload** section
6. Drag & drop a PDF file or click "Choose File"
7. Click **Upload Resume**
8. Go to **Browse Jobs** → Click on a job → **Apply Now**
9. Go to **My Applications** → Should see your application

### As Admin:
1. Login with admin credentials
2. Dashboard shows analytics
3. **Manage Users** → Can block/unblock users
4. **Manage Jobs** → Can delete jobs (Type column shows "job" or "internship")

---

## Troubleshooting

### Problem: "Cannot connect to server"
**Solution:** Make sure backend is running on port 5000. Check the terminal.

### Problem: Port 5000 already in use
**Solution:** 
```bash
npx -y kill-port 5000
npm start
```

### Problem: Profile not saving
**Solution:**
1. Open browser Console (F12 → Console tab)
2. Click Save Profile
3. Check for error messages
4. Check backend terminal for logs

### Problem: Type column empty in Admin dashboard
**Solution:** Hard refresh browser with `Ctrl+Shift+R`

### Problem: Resume upload not working
**Solution:** Make sure file is PDF/DOC/DOCX and under 5MB

---

## File Structure

```
job portal/
├── backend/
│   ├── database/
│   │   ├── init.js (Database setup)
│   │   └── zidioconnect.db (SQLite database file)
│   ├── middleware/
│   │   └── auth.js (JWT authentication)
│   ├── routes/
│   │   ├── auth.js (Login/Register)
│   │   ├── jobs.js (Job CRUD)
│   │   ├── applications.js (Apply/Track)
│   │   ├── profile.js (Profile management)
│   │   ├── bookmarks.js (Save jobs)
│   │   ├── notifications.js (Notifications)
│   │   └── admin.js (Admin panel)
│   ├── uploads/ (Resume/avatar files)
│   ├── .env (Environment variables)
│   ├── package.json
│   └── server.js (Entry point)
├── frontend/
│   ├── css/
│   │   ├── style.css (Main styles)
│   │   └── animations.css (Animations)
│   ├── js/
│   │   ├── config.js (API endpoints)
│   │   ├── auth.js (Auth module)
│   │   └── app.js (Main logic)
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── jobs.html
│   │   ├── internships.html
│   │   ├── dashboard.html
│   │   ├── profile.html
│   │   └── about.html
│   └── index.html (Landing page)
└── README.md
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/jobs | List all jobs |
| POST | /api/jobs | Create job (recruiter) |
| POST | /api/applications | Apply for job (student) |
| GET | /api/applications/my-applications | Student's applications |
| PUT | /api/profile/student | Update student profile |
| PUT | /api/profile/recruiter | Update recruiter profile |
| POST | /api/profile/resume | Upload resume |
| GET | /api/admin/analytics | Admin dashboard stats |

---

## Database Schema

### Users Table
- id, name, email, password, role (student/recruiter/admin), phone, avatar, is_active

### Student Profiles
- user_id, headline, bio, skills, education, experience, resume_path, linkedin, github, location

### Recruiter Profiles
- user_id, company_name, company_logo, company_website, company_description, industry, company_size, location

### Jobs
- id, recruiter_id, title, description, type (job/internship), category, location, work_mode, salary_min, salary_max, skills_required, experience_level, deadline, is_active

### Applications
- id, job_id, student_id, cover_letter, resume_path, status (pending/shortlisted/rejected/accepted)

### Bookmarks
- id, user_id, job_id

### Notifications
- id, user_id, title, message, type, is_read

---

## Support

If you encounter any issues:
1. Check backend terminal for error logs
2. Check browser console (F12) for frontend errors
3. Verify backend is running on http://localhost:5000
4. Try hard refresh (Ctrl+Shift+R)
5. Restart backend server

---

## Production Deployment Tips

1. Change `JWT_SECRET` in `.env` to a strong random string
2. Use a reverse proxy (Nginx) for the backend
3. Serve frontend as static files
4. Consider migrating from SQLite to PostgreSQL/MySQL for production
5. Add rate limiting and input validation
6. Enable HTTPS
7. Set up proper logging and monitoring
