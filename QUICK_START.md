# ZIDIOConnect - Quick Start Guide

## 🚀 Start in 3 Steps

### Step 1: Start Backend
```bash
cd "d:\job portal\backend"
npm start
```
Keep this terminal open.

### Step 2: Open Frontend
Double-click: `d:\job portal\frontend\index.html`

### Step 3: Login
- Admin: `admin@zidioconnect.com` / `admin123`
- Or click **Sign Up** to create new account

---

## ✅ Verify Everything Works

Run the automated test:
```bash
cd "d:\job portal\backend"
node test-api.js
```

This will test:
- ✅ Backend health check
- ✅ Student registration & profile update
- ✅ Recruiter registration & profile update
- ✅ Job posting

---

## 🔧 Common Issues

### Backend won't start
```bash
npx -y kill-port 5000
npm start
```

### Profile not saving
1. Open browser Console (F12)
2. Check for errors
3. Verify backend terminal shows logs when you click Save

### Type column empty
Press `Ctrl+Shift+R` to hard refresh browser

---

## 📋 Features Checklist

### Student Features:
- ✅ Register & Login
- ✅ Edit Profile (headline, skills, education, etc.)
- ✅ Upload Resume (PDF/DOC/DOCX)
- ✅ Browse Jobs & Internships
- ✅ Apply to Jobs
- ✅ Track Applications
- ✅ Bookmark Jobs
- ✅ Receive Notifications

### Recruiter Features:
- ✅ Register & Login
- ✅ Edit Company Profile
- ✅ Post Jobs/Internships
- ✅ View My Jobs
- ✅ View Applications
- ✅ Shortlist/Reject Candidates
- ✅ Receive Notifications

### Admin Features:
- ✅ View Analytics Dashboard
- ✅ Manage Users (block/unblock)
- ✅ Manage Jobs (delete)
- ✅ View All Applications

---

## 🎨 UI Features

- ✅ Animated landing page with particles
- ✅ Smooth scroll animations
- ✅ Hover effects and transitions
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Drag & drop file upload
- ✅ Responsive design
- ✅ Modern gradient design

---

## 📁 Project Structure

```
backend/  → Node.js API (Port 5000)
frontend/ → HTML/CSS/JS (Open in browser)
```

---

## 🆘 Need Help?

1. Check `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Check backend terminal for error logs
3. Check browser console (F12) for frontend errors
4. Make sure backend is running before opening frontend

---

## 🎯 Test Workflow

1. **Register as Recruiter** → Post a job
2. **Register as Student** → Apply to that job
3. **Login as Recruiter** → View applications → Shortlist
4. **Login as Student** → Check notifications → See "shortlisted" status
5. **Login as Admin** → View analytics → Manage users/jobs

---

**Everything is ready to use! Just start the backend and open the frontend.**
