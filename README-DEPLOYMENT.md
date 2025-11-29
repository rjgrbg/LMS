# SCOSCI1 LMS - Deployment Guide

## Important Note About Render

**Render doesn't natively support PHP applications.** Your LMS is built with PHP and MySQL, which works best on traditional hosting platforms.

## Recommended Hosting Options (Better than Render for PHP):

### 1. **InfinityFree** (FREE)
- ✅ Free PHP & MySQL hosting
- ✅ No credit card required
- ✅ Perfect for student projects
- 🔗 https://infinityfree.net

**Steps:**
1. Sign up at InfinityFree
2. Create a new account
3. Upload files via File Manager or FTP
4. Import `scosci1_lms.sql` to MySQL database
5. Update database credentials in `api/db-config.php`

### 2. **000webhost** (FREE)
- ✅ Free PHP & MySQL hosting
- ✅ Easy to use
- 🔗 https://www.000webhost.com

### 3. **Hostinger** (Paid - $2-3/month)
- ✅ Professional hosting
- ✅ Fast performance
- ✅ 24/7 support
- 🔗 https://www.hostinger.com

### 4. **Railway** (Alternative to Render)
- ✅ Supports PHP via Docker
- ✅ Free tier available
- 🔗 https://railway.app

## If You Still Want to Use Render:

### Prerequisites:
1. GitHub account
2. Render account
3. MySQL database (use Render PostgreSQL or external MySQL like PlanetScale)

### Steps:

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Create MySQL Database:**
   - Option A: Use PlanetScale (free MySQL): https://planetscale.com
   - Option B: Use Render PostgreSQL (requires code changes)
   - Option C: Use external MySQL provider

3. **Deploy on Render:**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will detect the Dockerfile
   - Add environment variables:
     - `DB_HOST`: your-database-host
     - `DB_USER`: your-database-user
     - `DB_PASS`: your-database-password
     - `DB_NAME`: scosci1_lms
     - `DB_PORT`: 3306
   - Click "Create Web Service"

4. **Import Database:**
   - Connect to your MySQL database
   - Import `scosci1_lms.sql`

## Files Created for Deployment:

- `Dockerfile` - Docker configuration for Render
- `render.yaml` - Render service configuration
- `.dockerignore` - Files to exclude from Docker
- `.gitignore` - Files to exclude from Git

## Database Setup:

Your database file is `scosci1_lms.sql`. Import this to your production database.

## Environment Variables Needed:

- `DB_HOST` - Database host (e.g., mysql.example.com)
- `DB_USER` - Database username
- `DB_PASS` - Database password
- `DB_NAME` - Database name (scosci1_lms)
- `DB_PORT` - Database port (usually 3306)

## Testing Locally with Docker:

```bash
docker build -t scosci1-lms .
docker run -p 8080:80 \
  -e DB_HOST=your-host \
  -e DB_USER=your-user \
  -e DB_PASS=your-pass \
  -e DB_NAME=scosci1_lms \
  scosci1-lms
```

Visit: http://localhost:8080

## Troubleshooting:

1. **Database connection fails:**
   - Check environment variables
   - Verify database is accessible from Render
   - Check firewall rules

2. **File uploads not working:**
   - Ensure uploads directory has write permissions
   - Check file size limits

3. **Session issues:**
   - Sessions work differently in containerized environments
   - May need Redis for session storage in production

## My Recommendation:

For a PHP project like yours, I strongly recommend **InfinityFree** or **000webhost** instead of Render. They're:
- Free
- Designed for PHP
- Much easier to set up
- No Docker knowledge needed
- Better for student projects

Would you like help deploying to InfinityFree instead? yes

