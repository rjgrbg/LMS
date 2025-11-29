# Deploy SCOSCI1 LMS to InfinityFree - Step by Step Guide

## Why InfinityFree?
- ✅ **100% FREE** - No credit card needed
- ✅ **PHP & MySQL** - Perfect for your project
- ✅ **Easy Setup** - No Docker or complex config
- ✅ **Great for Students** - Ideal for school projects

---

## Step 1: Sign Up for InfinityFree

1. Go to: **https://infinityfree.net**
2. Click **"Sign Up"**
3. Enter your email and create a password
4. Verify your email
5. Login to your account

---

## Step 2: Create a Hosting Account

1. After login, click **"Create Account"**
2. Choose a subdomain name (e.g., `scosci1lms.infinityfreeapp.com`)
   - Or use your own domain if you have one
3. Leave password blank (it will auto-generate)
4. Click **"Create Account"**
5. Wait 2-5 minutes for account activation

---

## Step 3: Upload Your Files

### Option A: Using File Manager (Easier)

1. In your InfinityFree control panel, click **"File Manager"**
2. Navigate to **`htdocs`** folder (this is your public folder)
3. **Delete** the default files in htdocs
4. Click **"Upload"** button
5. Upload ALL your project files:
   - `index.html`
   - `login.html`
   - `signup.html`
   - `admin.html`
   - `style.css`
   - `script.js`
   - `admin-script.js`
   - `auth.js`
   - `.htaccess`
   - `api/` folder (with all PHP files inside)
   - `uploads/` folder (create empty folder)

### Option B: Using FTP (Faster for many files)

1. Download **FileZilla** (free FTP client): https://filezilla-project.org
2. In InfinityFree, go to **"FTP Details"**
3. Copy your FTP credentials:
   - FTP Hostname
   - FTP Username
   - FTP Password
4. Open FileZilla and connect using those credentials
5. Navigate to **`htdocs`** folder on the right side
6. Drag and drop all your project files from left to right

---

## Step 4: Create MySQL Database

1. In InfinityFree control panel, click **"MySQL Databases"**
2. Click **"Create Database"**
3. Enter database name: `scosci1_lms`
4. Click **"Create Database"**
5. **SAVE THESE DETAILS** (you'll need them):
   ```
   Database Name: epiz_XXXXXXXX_scosci1_lms
   Database Username: epiz_XXXXXXXX
   Database Password: [your password]
   Database Hostname: sqlXXX.infinityfree.com
   ```

---

## Step 5: Import Database

1. In InfinityFree control panel, click **"phpMyAdmin"**
2. Login with your database credentials
3. Click on your database name (left sidebar)
4. Click **"Import"** tab at the top
5. Click **"Choose File"**
6. Select your **`scosci1_lms.sql`** file
7. Scroll down and click **"Go"**
8. Wait for success message

---

## Step 6: Update Database Configuration

1. Go back to File Manager
2. Navigate to **`htdocs/api/db-config.php`**
3. Click **"Edit"** (or right-click → Edit)
4. Update these lines with YOUR database details:

```php
define('DB_HOST', 'sqlXXX.infinityfree.com');  // Your DB hostname
define('DB_USER', 'epiz_XXXXXXXX');            // Your DB username
define('DB_PASS', 'your_password_here');       // Your DB password
define('DB_NAME', 'epiz_XXXXXXXX_scosci1_lms'); // Your DB name
define('DB_PORT', 3306);
```

5. Click **"Save Changes"**

---

## Step 7: Set Folder Permissions

1. In File Manager, right-click on **`uploads`** folder
2. Click **"Change Permissions"** or **"CHMOD"**
3. Set to **`755`** or **`777`**
4. Click **"Change Permissions"**

---

## Step 8: Test Your Website

1. Open your website URL (e.g., `http://scosci1lms.infinityfreeapp.com`)
2. You should see your homepage
3. Test these features:
   - ✅ View materials on homepage
   - ✅ Sign up new account
   - ✅ Login as student
   - ✅ Login as admin (username: admin, password: password)
   - ✅ Upload a file as admin
   - ✅ Download a file as student

---

## Default Admin Login

After importing the database, use these credentials:

- **Username:** `admin`
- **Password:** `password`

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

---

## Troubleshooting

### Problem: "Database connection failed"
**Solution:**
- Double-check database credentials in `api/db-config.php`
- Make sure you used the FULL database name (with epiz_ prefix)
- Verify database was imported successfully in phpMyAdmin

### Problem: "Can't upload files"
**Solution:**
- Check `uploads` folder permissions (should be 755 or 777)
- Make sure `uploads` folder exists in htdocs

### Problem: "Page not found" or "404 error"
**Solution:**
- Make sure all files are in `htdocs` folder, not in a subfolder
- Check that `.htaccess` file was uploaded

### Problem: "Session not working" or "Can't login"
**Solution:**
- InfinityFree sometimes has session issues
- Try clearing browser cache and cookies
- Make sure cookies are enabled in browser

### Problem: "File upload size limit"
**Solution:**
- InfinityFree has a 10MB upload limit per file
- For larger files, you may need to upgrade or use paid hosting

---

## File Structure on InfinityFree

Your `htdocs` folder should look like this:

```
htdocs/
├── index.html
├── login.html
├── signup.html
├── admin.html
├── style.css
├── script.js
├── admin-script.js
├── auth.js
├── .htaccess
├── api/
│   ├── check-auth.php
│   ├── db-config.php
│   ├── delete-material.php
│   ├── download-all.php
│   ├── download-material.php
│   ├── get-materials.php
│   ├── get-users.php
│   ├── login.php
│   ├── logout.php
│   ├── signup.php
│   ├── update-material.php
│   └── upload-material.php
└── uploads/
    └── (uploaded files will go here)
```

---

## Important Notes

1. **Free Hosting Limitations:**
   - 5GB storage
   - Unlimited bandwidth
   - 10MB max file upload
   - May show ads (can be removed with premium)

2. **Backup Your Database:**
   - Regularly export your database from phpMyAdmin
   - Download as SQL file
   - Keep it safe!

3. **Security:**
   - Change default admin password
   - Don't share your database credentials
   - Keep your files backed up

---

## Need Help?

If you encounter any issues:
1. Check InfinityFree support forum: https://forum.infinityfree.net
2. Review error messages in browser console (F12)
3. Check PHP error logs in InfinityFree control panel

---

## Next Steps After Deployment

1. ✅ Change admin password
2. ✅ Test all features thoroughly
3. ✅ Share the URL with your classmates
4. ✅ Upload your course materials
5. ✅ Monitor the uploads folder size

---

**Your LMS is now live! 🎉**

Share your URL: `http://your-subdomain.infinityfreeapp.com`
