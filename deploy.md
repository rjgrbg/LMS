# Quick Deployment Guide

## Option 1: Render + Clever Cloud (Recommended for Free Hosting)

### Quick Steps:
1. **Setup Clever Cloud Database** (5 minutes)
   - Sign up at clever-cloud.com
   - Create MySQL add-on (DEV plan - Free)
   - Import `scosci1_lms.sql` to your database
   - Save credentials

2. **Deploy to Render** (10 minutes)
   - Push code to GitHub/GitLab
   - Sign up at render.com
   - Create new Web Service from your repo
   - Add environment variables (DB credentials from Clever Cloud)
   - Deploy!

📖 **Full Guide**: See `RENDER-CLEVERCLOUD-DEPLOYMENT.md`

---

## Option 2: InfinityFree (Traditional Hosting)

### Quick Steps:
1. Sign up at infinityfree.com
2. Create database via cPanel
3. Import `scosci1_lms.sql`
4. Update `api/db-config.php` with credentials
5. Upload files via FTP to `htdocs`

📖 **Full Guide**: See `INFINITYFREE-DEPLOYMENT.md`

---

## Before Deploying

Make sure you have:
- [ ] Tested locally
- [ ] Database backup (`scosci1_lms.sql`)
- [ ] Git repository (for Render)
- [ ] Account on chosen platform

---

## After Deployment

Test these features:
- [ ] Login/Signup
- [ ] File upload
- [ ] Admin dashboard
- [ ] Profile pictures
- [ ] Material downloads

---

## Need Help?

Check the detailed guides:
- `RENDER-CLEVERCLOUD-DEPLOYMENT.md` - For Render + Clever Cloud
- `INFINITYFREE-DEPLOYMENT.md` - For InfinityFree
