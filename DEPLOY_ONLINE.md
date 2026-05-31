# 🌐 Deploy ZIDIOConnect Online (Free)

## Architecture
- **Frontend** → Netlify (free, static hosting)
- **Backend** → Render.com (free, Node.js hosting)

---

## STEP 1: Push to GitHub

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `zidioconnect`
3. Keep it Public
4. Click **Create repository**

### 1.2 Push Code to GitHub
Open terminal in `d:\job portal` and run:

```bash
git init
git add .
git commit -m "Initial commit - ZIDIOConnect Job Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zidioconnect.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## STEP 2: Deploy Backend on Render.com (Free)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)

### 2.2 Create New Web Service
1. Click **New** → **Web Service**
2. Connect your GitHub repository (`zidioconnect`)
3. Configure:
   - **Name:** `zidioconnect-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

### 2.3 Add Environment Variables
In the Render dashboard, go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| JWT_SECRET | `zidioconnect_super_secure_key_2024_production` |
| JWT_EXPIRES_IN | `7d` |
| NODE_ENV | `production` |
| PORT | `5000` |

### 2.4 Deploy
Click **Create Web Service**. Wait 2-3 minutes for deployment.

Your backend URL will be: `https://zidioconnect-backend.onrender.com`

### 2.5 Verify Backend
Open in browser: `https://zidioconnect-backend.onrender.com/api/health`

You should see: `{"status":"OK","message":"ZIDIOConnect API is running."}`

---

## STEP 3: Deploy Frontend on Netlify (Free)

### 3.1 Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub

### 3.2 Deploy Frontend
1. Click **Add new site** → **Import an existing project**
2. Connect to GitHub → Select your `zidioconnect` repo
3. Configure:
   - **Base directory:** `frontend`
   - **Build command:** (leave empty)
   - **Publish directory:** `frontend`
4. Click **Deploy site**

### 3.3 Your Frontend URL
Netlify will give you a URL like: `https://zidioconnect.netlify.app`

---

## STEP 4: Connect Frontend to Backend

### 4.1 Update Frontend Config
Edit `frontend/js/config.js` and change the production URL:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://zidioconnect-backend.onrender.com/api';  // ← Your Render URL
```

### 4.2 Push the Change
```bash
git add .
git commit -m "Update API URL for production"
git push
```

Both Netlify and Render will auto-redeploy.

---

## STEP 5: Test Online

1. Open your Netlify URL: `https://zidioconnect.netlify.app`
2. Register a new account
3. Login and test all features

---

## ⚠️ Important Notes

### Free Tier Limitations (Render.com)
- **Cold starts:** Free tier sleeps after 15 min of inactivity. First request takes ~30 seconds.
- **Storage:** SQLite database resets on redeploy (for permanent data, upgrade to paid or use PostgreSQL)
- **750 hours/month** free

### Free Tier Limitations (Netlify)
- **100 GB bandwidth/month**
- **Custom domain** supported for free
- **HTTPS** included automatically

### Custom Domain (Optional)
1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Netlify: **Domain settings** → Add custom domain
3. In Render: **Settings** → Add custom domain

---

## 🔄 How to Update

After making changes locally:
```bash
git add .
git commit -m "Your change description"
git push
```

Both Netlify and Render will auto-redeploy from GitHub.

---

## 📋 Summary

| Service | URL | Purpose |
|---------|-----|---------|
| GitHub | github.com/YOUR_USERNAME/zidioconnect | Source code |
| Render | zidioconnect-backend.onrender.com | Backend API |
| Netlify | zidioconnect.netlify.app | Frontend website |

---

## 🆘 Troubleshooting

### "Cannot connect to server" on live site
- Check Render dashboard → is the service running?
- Check the API URL in `frontend/js/config.js`
- Render free tier sleeps — wait 30 seconds and try again

### CORS errors
- Make sure backend allows your Netlify domain
- Check browser console for specific error

### Data disappears after redeploy
- SQLite stores data in a file — Render's free tier doesn't persist files
- For production, consider upgrading to Render's paid tier or using a hosted database

---

**That's it! Your job portal will be live and accessible to everyone worldwide! 🎉**
