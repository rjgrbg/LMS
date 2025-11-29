# Clever Cloud MySQL Setup Guide for Render Deployment

## Why Clever Cloud?
- ✅ **FREE MySQL Database** (256MB storage)
- ✅ **Remote Access Allowed** (works with Render)
- ✅ **Easy Setup** (5 minutes)
- ✅ **Reliable** (better than InfinityFree for external connections)

---

## Step 1: Create Clever Cloud Account

1. Go to: **https://www.clever-cloud.com/**
2. Click **"Sign Up"** (top right)
3. Sign up with **GitHub** (easiest) or email
4. Verify your email if needed
5. Complete the onboarding

---

## Step 2: Create MySQL Add-on

1. Click **"Create..."** button (top right corner)
2. Select **"an add-on"**
3. Choose **"MySQL"**
4. Select **"DEV"** plan (FREE - 256MB storage)
5. Choose a region:
   - **EU** if your Render server is in Europe
   - **US** if your Render server is in North America
6. Name it: `scosci1-lms-db`
7. Click **"Create"**
8. Wait 1-2 minutes for provisioning

---

## Step 3: Get Database Credentials

1. Click on your newly created MySQL add-on
2. Go to **"Environment variables"** tab (left sidebar)
3. You'll see these credentials:

```
MYSQL_ADDON_HOST: bxxxxxx-mysql.services.clever-cloud.com
MYSQL_ADDON_USER: uxxxxxx
MYSQL_ADDON_PASSWORD: xxxxxxxxxx
MYSQL_ADDON_DB: bxxxxxx
MYSQL_ADDON_PORT: 3306
```

4. **COPY THESE VALUES** - you'll need them!

---

## Step 4: Import Your Database

### Option A: Using phpMyAdmin (Easier)

1. In Clever Cloud, go to your MySQL add-on
2. Look for **"phpMyAdmin"** link or button
3. Click it to open phpMyAdmin
4. Login automatically (credentials are pre-filled)
5. Click **"Import"** tab
6. Click **"Choose File"**
7. Select `scosci1_lms_infinityfree.sql` (the modified version without CREATE DATABASE)
8. Click **"Go"**
9. Wait for success message

### Option B: Using MySQL Command Line

If you have MySQL installed locally:

```bash
mysql -h bxxxxxx-mysql.services.clever-cloud.com -u uxxxxxx -p bxxxxxx < scosci1_lms_infinityfree.sql
```

Enter the password when prompted.

---

## Step 5: Configure Render Environment Variables

1. Go to your **Render Dashboard**: https://dashboard.render.com
2. Select your **Web Service** (your LMS deployment)
3. Click **"Environment"** tab (left sidebar)
4. Click **"Add Environment Variable"**
5. Add these 4 variables:

| Key | Value |
|-----|-------|
| `DB_HOST` | `bxxxxxx-mysql.services.clever-cloud.com` |
| `DB_USER` | `uxxxxxx` |
| `DB_PASS` | `xxxxxxxxxx` |
| `DB_NAME` | `bxxxxxx` |

6. Click **"Save Changes"**
7. Render will automatically redeploy (takes 2-3 minutes)

---

## Step 6: Test Your Connection

### Method 1: Using test-connection.php

1. After Render redeploys, visit:
   ```
   https://your-app.onrender.com/test-connection.php
   ```

2. You should see:
   ```json
   {
     "success": true,
     "message": "Database connection successful!",
     "database": "bxxxxxx"
   }
   ```

### Method 2: Test Login

1. Go to your app: `https://your-app.onrender.com`
2. Click **"Login"**
3. Use default admin credentials:
   - Username: `admin`
   - Password: `admin123`
4. If login works, database is connected! ✅

---

## Step 7: Verify Everything Works

Test these features:

- ✅ View materials on homepage
- ✅ Sign up new account
- ✅ Login as student
- ✅ Login as admin
- ✅ Upload a file as admin
- ✅ Download a file as student
- ✅ Edit material as admin
- ✅ Delete material as admin

---

## Default Admin Credentials

After importing the database:

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change this password immediately after first login!

---

## Troubleshooting

### Problem: "Database connection failed"

**Check these:**
1. Verify environment variables are set correctly in Render
2. Make sure you used the FULL hostname from Clever Cloud
3. Check that database was imported successfully
4. Verify Clever Cloud MySQL add-on is running (green status)

**Solution:**
- Go to Render → Environment tab
- Double-check all 4 variables match Clever Cloud exactly
- Redeploy manually if needed

### Problem: "Access denied for user"

**Solution:**
- The username/password is wrong
- Go back to Clever Cloud and copy credentials again
- Update Render environment variables
- Make sure there are no extra spaces in the values

### Problem: "Unknown database"

**Solution:**
- The database name is wrong
- Use the exact `MYSQL_ADDON_DB` value from Clever Cloud
- It should look like `bxxxxxx` (starts with 'b')

### Problem: "Can't connect to MySQL server"

**Solution:**
- The hostname is wrong
- Use the full hostname: `bxxxxxx-mysql.services.clever-cloud.com`
- Make sure port is `3306`

### Problem: Tables don't exist

**Solution:**
- Database wasn't imported properly
- Go to Clever Cloud phpMyAdmin
- Check if tables exist: `materials`, `users`, `downloads`
- If not, import `scosci1_lms_infinityfree.sql` again

---

## Local Development Setup

If you want to test locally:

1. Keep using your local XAMPP MySQL
2. The code will automatically use local settings when environment variables aren't set
3. Default local settings:
   - Host: `localhost`
   - User: `root`
   - Password: (empty)
   - Database: `scosci1_lms`

---

## Monitoring Your Database

### Check Database Size

1. Go to Clever Cloud dashboard
2. Click on your MySQL add-on
3. Check **"Metrics"** tab
4. Monitor storage usage (free tier = 256MB)

### Backup Your Database

**Important:** Regularly backup your data!

1. Go to Clever Cloud phpMyAdmin
2. Click **"Export"** tab
3. Select **"Quick"** export method
4. Click **"Go"**
5. Save the SQL file to your computer

---

## Upgrading (If Needed)

If you exceed 256MB storage:

1. Clever Cloud offers paid plans starting at ~$5/month
2. Or migrate to another service
3. Export your data first before any changes

---

## Important Notes

1. **Free Tier Limits:**
   - 256MB storage
   - Shared resources
   - May sleep after inactivity (wakes up automatically)

2. **Connection Limits:**
   - Free tier has connection limits
   - Should be fine for small to medium traffic

3. **Security:**
   - Change default admin password
   - Don't share database credentials
   - Keep backups!

---

## Summary

Your setup:
- **Frontend/Backend:** Render (free tier)
- **Database:** Clever Cloud MySQL (free tier)
- **Total Cost:** $0 💰

This is a production-ready setup for your school project!

---

## Need Help?

- Clever Cloud Docs: https://www.clever-cloud.com/doc/
- Clever Cloud Support: support@clever-cloud.com
- Check Render logs: Dashboard → Logs tab

---

**Your LMS is now fully deployed! 🎉**

Share your URL: `https://your-app.onrender.com`
