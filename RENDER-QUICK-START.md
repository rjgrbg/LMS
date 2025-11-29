# Render Deployment - Quick Start (5 Steps)

## What You Need
- GitHub account
- Render account  
- Railway account (for MySQL database)

---

## Step 1: Push to GitHub (2 minutes)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/scosci1-lms.git
git push -u origin main
```

---

## Step 2: Create MySQL Database on Railway (3 minutes)

1. Go to https://railway.app
2. Login with GitHub
3. Click "New Project" → "Provision MySQL"
4. Save these credentials from "Variables" tab:
   - MYSQL_HOST
   - MYSQL_PORT
   - MYSQL_USER
   - MYSQL_PASSWORD
   - MYSQL_DATABASE

---

## Step 3: Import Database (2 minutes)

**Option A: Using Railway CLI**
```bash
npm i -g @railway/cli
railway login
railway link
railway run mysql -h HOST -P PORT -u root -p DATABASE < scosci1_lms.sql
```

**Option B: Using MySQL Workbench**
1. Download MySQL Workbench
2. Connect with Railway credentials
3. Import `scosci1_lms.sql`

---

## Step 4: Deploy on Render (5 minutes)

1. Go to https://render.com
2. Login with GitHub
3. Click "New +" → "Web Service"
4. Select your `scosci1-lms` repository
5. Settings:
   - **Runtime:** Docker
   - **Instance Type:** Free
6. Add Environment Variables:
   ```
   DB_HOST=your-railway-host
   DB_PORT=your-railway-port
   DB_USER=root
   DB_PASS=your-railway-password
   DB_NAME=railway
   ```
7. Click "Create Web Service"

---

## Step 5: Test Your Site (2 minutes)

1. Wait for deployment (5-10 minutes)
2. Click your Render URL: `https://scosci1-lms.onrender.com`
3. Test:
   - Homepage loads ✅
   - Login as admin (username: admin, password: password) ✅
   - Upload a file ✅
   - Download a file ✅

---

## ⚠️ Important Warnings

1. **Free tier spins down** after 15 min inactivity
   - First load takes 30-60 seconds
   
2. **Files don't persist** on free tier
   - Uploaded files deleted on restart
   - Need paid plan ($7/month) for persistent storage

3. **Change admin password** immediately after deployment

---

## Total Time: ~15 minutes
## Total Cost: $0 (free tier)

---

## Quick Troubleshooting

**Site won't load?**
- Check Render logs
- Verify environment variables

**Database error?**
- Check Railway database is running
- Verify credentials are correct

**Files disappear?**
- Expected on free tier
- Upgrade to paid for persistence

---

**Done! Your LMS is live! 🎉**
