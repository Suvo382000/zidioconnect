# ZIDIOConnect - Job & Internship Portal

A comprehensive web-based portal to streamline and manage internships and job opportunities for students and recruiters.

## Project Structure

```
job portal/
├── frontend/           # Frontend (HTML, CSS, JavaScript)
│   ├── index.html      # Landing page
│   ├── css/
│   │   ├── style.css       # Main styles
│   │   └── animations.css  # Animations & effects
│   ├── js/
│   │   ├── config.js   # API configuration
│   │   ├── auth.js     # Authentication module
│   │   └── app.js      # Main application logic
│   └── pages/
│       ├── login.html
│       ├── register.html
│       ├── jobs.html
│       ├── internships.html
│       ├── dashboard.html
│       ├── profile.html
│       └── about.html
├── backend/            # Backend (Node.js + Express + SQLite)
│   ├── server.js       # Entry point
│   ├── database/
│   │   └── init.js     # Database schema & initialization
│   ├── middleware/
│   │   └── auth.js     # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js     # Login/Register/Me
│   │   ├── jobs.js     # CRUD for jobs
│   │   ├── applications.js  # Apply, track, manage
│   │   ├── profile.js  # Profile management
│   │   ├── bookmarks.js    # Save/unsave jobs
│   │   ├── notifications.js # Notifications
│   │   └── admin.js    # Admin panel APIs
│   └── uploads/        # File uploads (resumes, avatars)
└── README.md
```

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** SQLite (via better-sqlite3) - zero config, easy to deploy
- **Auth:** JWT (JSON Web Tokens)
- **File Upload:** Multer

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

The server will start at `http://localhost:5000`

### 2. Frontend Setup

Simply open `frontend/index.html` in your browser, or use a live server:

```bash
# Using VS Code Live Server extension, or:
npx serve frontend
```

### 3. Default Admin Credentials

- **Email:** admin@zidioconnect.com
- **Password:** admin123

## Key Modules

1. **Authentication** - Student, Recruiter, Admin logins with role-based access
2. **Student Dashboard** - Profile, resume upload, apply to jobs, track applications
3. **Recruiter Dashboard** - Post jobs/internships, view applications, shortlist/reject
4. **Admin Panel** - User management (block/unblock), content moderation, analytics
5. **Job Management** - Search, filter, bookmark, apply with notifications

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/jobs | List jobs (with filters) |
| POST | /api/jobs | Create job (recruiter) |
| POST | /api/applications | Apply for job (student) |
| GET | /api/applications/my-applications | Student's applications |
| PUT | /api/applications/:id/status | Update status (recruiter) |
| GET | /api/admin/analytics | Dashboard stats (admin) |
| PUT | /api/admin/users/:id/toggle-status | Block/unblock user |

## Deployment

The SQLite database requires no external setup - it creates a file automatically. For production:

1. Set `JWT_SECRET` to a strong random string in `.env`
2. Use `pm2` or similar for process management
3. Serve frontend via Nginx or any static file server
4. Consider using a reverse proxy for the API
