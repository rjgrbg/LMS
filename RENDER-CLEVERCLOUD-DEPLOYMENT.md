# Render + Clever Cloud Deployment Guide

This guide will help you deploy your LMS application with:
- **Render**: Hosting the PHP web application (Free tier)
- **Clever Cloud**: Hosting the MySQL database (Free tier)

---

## Part 1: Deploy MySQL Database on Clever Cloud

### Step 1: Create Clever Cloud Account
1. Go to https://www.clever-cloud.com/
2. Sign up for a free account
3. Verify your email

### Step 2: Create MySQL Add-on
1. Click "Create" → "an add-on"
2. Select "MySQL"
3. Choose the **DEV plan** (Free tier)
4. Name it: `scosci1-lms-db`
5. Click "Create"

### Step 3: Get Database Credentials
1. Click on your MySQL add-on
2. Go to "Environment variables" or "Information" tab
3. Note down these credentials:
   - `MYSQL_ADDON_HOST` (hostname)
   - `MYSQL_ADDON_USER` (username)
   - `MYSQL_ADDON_PASSWORD` (password)
   - `MYSQL_ADDON_DB` (database name)
   - `MYSQL_ADDON_PORT` (usually 3306)

### Step 4: Import Database
1. Install MySQL client or use phpMyAdmin
2. Connect using the credentials from Step 3

**Using MySQL command line:**
```bash
mysql -h [MYSQL_ADDON_HOST] -u [MYSQL_ADDON_USER] -p[MYSQL_ADDON_PASSWORD] [MYSQL_ADDON_DB] < scosci1_lms.sql
```

**Or use a GUI tool like:**
- MySQL Workbench
- DBeaver
- phpMyAdmin (if available)

---

## Part 2: Deploy Web Application on Render

### Step 1: Prepare Git Repository
1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit for Render deployment"
```

2. Push to GitHub/GitLab/Bitbucket:
```bash
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Create Render Account
1. Go to https://render.com/
2. Sign up (can use GitHub account)
3. Verify your email

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your Git repository
3. Configure the service:
   - **Name**: `scosci1-lms`
   - **Runtime**: PHP
   - **Build Command**: Leave empty or use: `echo "No build needed"`
   - **Start Command**: `php -S 0.0.0.0:$PORT -t .`
   - **Plan**: Free

### Step 4: Add Environment Variables
In Render dashboard, go to "Environment" tab and add:

```
DB_HOST = [Your Clever Cloud MYSQL_ADDON_HOST]
DB_USER = [Your Clever Cloud MYSQL_ADDON_USER]
DB_PASS = [Your Clever Cloud MYSQL_ADDON_PASSWORD]
DB_NAME = [Your Clever Cloud MYSQL_ADDON_DB]
DB_PORT = 3306
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically deploy your app
3. Wait for deployment to complete (5-10 minutes)
4. Your app will be available at: `https://scosci1-lms.onrender.com`

---

## Part 3: Post-Deployment Configuration

### Create Required Directories
Since Render uses ephemeral storage, you may need to handle file uploads differently. For now, the directories will be created automatically by PHP when files are uploaded.

### Test Your Application
1. Visit your Render URL
2. Test login/signup
3. Test file uploads
4. Test admin dashboard

---

## Important Notes

### Render Free Tier Limitations:
- **Spin down after 15 minutes** of inactivity
- First request after spin down takes 30-60 seconds
- 750 hours/month free (enough for one service)
- Ephemeral storage (files uploaded will be lost on restart)

### Clever Cloud Free Tier Limitations:
- **256 MB storage** for MySQL
- **5 concurrent connections**
- Suitable for development/testing

### File Upload Considerations:
Since Render has ephemeral storage, uploaded files will be lost when the service restarts. Consider:
1. Using cloud storage (AWS S3, Cloudinary, etc.)
2. Upgrading to Render's paid plan with persistent disks
3. Storing files in database as BLOB (not recommended for large files)

---

## Alternative: Use Render for Both Web + Database

Render also offers PostgreSQL databases. If you want everything on Render:

1. Create a PostgreSQL database on Render (Free tier: 90 days)
2. Convert your MySQL schema to PostgreSQL
3. Update PHP code to use PostgreSQL instead of MySQL

---

## Troubleshooting

### Database Connection Failed
- Verify environment variables in Render dashboard
- Check Clever Cloud database is running
- Ensure database was imported correctly
- Check if Clever Cloud allows external connections

### 500 Internal Server Error
- Check Render logs: Dashboard → Logs
- Verify PHP version compatibility
- Check file permissions

### Slow First Load
- This is normal on free tier (cold start)
- Service spins down after 15 minutes of inactivity
- Consider upgrading to paid plan for always-on service

### File Upload Issues
- Remember: Render free tier has ephemeral storage
- Files will be deleted on service restart
- Consider using external storage service

---

## Upgrading to Production

For production use, consider:
1. **Render Starter Plan** ($7/month) - Always on, persistent disk
2. **Clever Cloud Paid Plan** - More storage and connections
3. **Cloud Storage** - AWS S3, Cloudinary for file uploads
4. **CDN** - CloudFlare for static assets
5. **Custom Domain** - Add your own domain name

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Clever Cloud Docs**: https://www.clever-cloud.com/doc/
- **Render Community**: https://community.render.com/
- **Clever Cloud Support**: support@clever-cloud.com

---

## Quick Reference Commands

### Check Render Logs:
```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# View logs
render logs
```

### Connect to Clever Cloud Database:
```bash
mysql -h [HOST] -u [USER] -p[PASSWORD] [DATABASE]
```

### Git Deployment:
```bash
git add .
git commit -m "Update"
git push origin main
# Render auto-deploys on push
```
