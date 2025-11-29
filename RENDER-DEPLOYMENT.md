# Deploy SCOSCI1 LMS to Render - Complete Guide

## Prerequisites

1. **GitHub Account** - https://github.com
2. **Render Account** - https://render.com
3. **MySQL Database** - We'll use Railway or PlanetScale (both have free tiers)

---

## Step 1: Push Your Code to GitHub

### 1.1 Initialize Git (if not already done)

Open your terminal/command prompt in your project folder:

```bash
git init
git add .
git commit -m "Initial commit - SCOSCI1 LMS"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `scosci1-lms`
4. Make it **Public** or **Private** (your choice)
5. **Don't** initialize with README (we already have files)
6. Click **"Create repository"**

### 1.3 Push to GitHub

Copy the commands from GitHub and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/scosci1-lms.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 2: Create MySQL Database (Using Railway)

### Why Railway?
- ✅ Free MySQL database
- ✅ Easy setup
- ✅ Works great with Render

### 2.1 Sign Up for Railway

1. Go to https://railway.app
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway

### 2.2 Create MySQL Database

1. Click **"New Project"**
2. Select **"Provision MySQL"**
3. Wait for database to be created (30 seconds)
4. Click on the **MySQL** service
5. Go to **"Variables"** tab
6. **SAVE THESE CREDENTIALS:**

```
MYSQL_HOST: containers-us-west-XXX.railway.app
MYSQL_PORT: 6XXX
MYSQL_USER: root
MYSQL_PASSWORD: [long password]
MYSQL_DATABASE: railway
```

### 2.3 Import Your Database

1. Download **MySQL Workbench** or use **phpMyAdmin**
2. Connect using Railway credentials
3. Import `scosci1_lms.sql` file

**OR use Railway CLI:**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Import database
railway run mysql -h MYSQL_HOST -P MYSQL_PORT -u root -p MYSQL_DATABASE < scosci1_lms.sql
```

---

## Step 3: Deploy to Render

### 3.1 Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub**
4. Authorize Render to access your repositories

### 3.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `scosci1-lms`
3. Click **"Connect"**

### 3.3 Configure Service

Fill in these settings:

- **Name:** `scosci1-lms`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Runtime:** `Docker`
- **Instance Type:** `Free`

### 3.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables (use your Railway database credentials):

```
DB_HOST=containers-us-west-XXX.railway.app
DB_PORT=6XXX
DB_USER=root
DB_PASS=your_railway_password
DB_NAME=railway
```

### 3.5 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Render will build your Docker container and deploy

---

## Step 4: Verify Deployment

1. Once deployed, Render will give you a URL like: `https://scosci1-lms.onrender.com`
2. Click the URL to open your LMS
3. Test these features:
   - ✅ Homepage loads
   - ✅ View materials
   - ✅ Sign up
   - ✅ Login as student
   - ✅ Login as admin (username: admin, password: password)
   - ✅ Upload file (may have size limits on free tier)

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ✅ Automatic HTTPS
- ✅ Custom domain support

**Railway Free Tier:**
- ✅ $5 credit/month
- ✅ Always on (doesn't spin down)
- ⚠️ Limited to 500 hours/month

### File Uploads

On Render's free tier:
- Files are stored in **ephemeral storage**
- Files will be **deleted** when the container restarts
- For persistent storage, you need:
  - Render Disk (paid feature)
  - Or external storage like AWS S3, Cloudinary

**Solution for file persistence:**
- Upgrade to paid plan ($7/month) with persistent disk
- Or use cloud storage (AWS S3, Cloudinary)

---

## Troubleshooting

### Problem: "Application failed to respond"
**Solution:**
- Check Render logs (click "Logs" tab)
- Verify environment variables are correct
- Make sure database is accessible

### Problem: "Database connection failed"
**Solution:**
- Verify Railway database is running
- Check DB_HOST, DB_PORT, DB_USER, DB_PASS are correct
- Make sure Railway allows external connections

### Problem: "Files disappear after upload"
**Solution:**
- This is expected on free tier (ephemeral storage)
- Upgrade to paid plan with persistent disk
- Or use external storage service

### Problem: "Site is slow to load"
**Solution:**
- Free tier spins down after inactivity
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast
- Upgrade to paid plan for always-on service

---

## Alternative: Use PlanetScale Instead of Railway

PlanetScale offers free MySQL with better limits:

1. Go to https://planetscale.com
2. Sign up with GitHub
3. Create new database
4. Get connection string
5. Use in Render environment variables

---

## Cost Comparison

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Render** | Free (with limitations) | $7/month (persistent storage) |
| **Railway** | $5 credit/month | $5/month + usage |
| **PlanetScale** | Free 5GB | $29/month |

---

## Recommended Setup

**For Testing/School Project:**
- ✅ Render Free + Railway Free
- ✅ Total cost: $0
- ⚠️ Files don't persist, site spins down

**For Production/Real Use:**
- ✅ Render Starter ($7/month) with persistent disk
- ✅ Railway MySQL ($5/month)
- ✅ Total: $12/month
- ✅ Always on, files persist

---

## Your Deployment URLs

After deployment, save these:

```
Website: https://scosci1-lms.onrender.com
GitHub: https://github.com/YOUR_USERNAME/scosci1-lms
Railway Dashboard: https://railway.app/project/YOUR_PROJECT_ID

Admin Login:
- Username: admin
- Password: password (CHANGE THIS!)
```

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Change admin password
3. ✅ Share URL with classmates
4. ✅ Monitor Render logs for errors
5. ✅ Set up custom domain (optional)

---

## Need Help?

- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **GitHub Issues:** Create issue in your repository

---

**Your LMS is now live on Render! 🚀**
