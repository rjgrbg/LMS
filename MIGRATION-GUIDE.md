# Migration Guide: PHP to Node.js

## What Changed

Your PHP application has been converted to a Node.js/Express application while maintaining the same functionality and API endpoints.

## Key Changes

### Backend
- **PHP** → **Node.js with Express**
- **Apache/PHP sessions** → **express-session**
- **mysqli** → **mysql2 with connection pooling**
- **password_hash/verify** → **bcryptjs**
- **move_uploaded_file** → **multer middleware**

### File Structure
```
OLD (PHP):                    NEW (Node.js):
├── api/*.php                 ├── routes/*.js
├── *.html                    ├── public/*.html
├── *.css                     ├── public/*.css
├── *.js                      ├── public/*.js
└── uploads/                  ├── server.js
                              ├── config/db.js
                              ├── middleware/auth.js
                              └── uploads/
```

### API Endpoints
All endpoints maintain the same paths (e.g., `/api/login.php`) for frontend compatibility. No frontend changes needed!

## Setup Steps

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Verify: `node --version`

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database**
   - Edit `.env` file with your MySQL credentials
   - Database schema remains the same (use existing `scosci1_lms.sql`)

4. **Start the server**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

5. **Access application**
   - Open `http://localhost:3000`
   - Same login credentials work

## Benefits of Node.js Version

✅ **Better Performance**: Non-blocking I/O, handles concurrent requests efficiently
✅ **Modern Stack**: JavaScript everywhere (frontend + backend)
✅ **Easy Deployment**: Works on any platform (Heroku, AWS, DigitalOcean, etc.)
✅ **Package Management**: npm ecosystem with thousands of packages
✅ **Development Speed**: Hot reload with nodemon
✅ **Scalability**: Better for real-time features and microservices

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode)
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### Option 2: Platform as a Service
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo

### Option 3: Serverless
- **Vercel**: Add `vercel.json` config
- **AWS Lambda**: Use serverless framework

## Troubleshooting

**Port already in use?**
```bash
# Change PORT in .env file
PORT=3001
```

**Database connection error?**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

**File upload not working?**
- Check `uploads/` folder exists and is writable
- Verify file size limits in `routes/materials.js`

## Keeping PHP Version

You can keep both versions running:
- PHP version: `http://localhost/LMS-scosci/` (Apache)
- Node.js version: `http://localhost:3000/` (Node)

Just use different ports and they won't conflict.

## Next Steps

1. Test all features (login, upload, download, etc.)
2. Update SESSION_SECRET in `.env` for production
3. Configure production database
4. Set up reverse proxy (nginx) for production
5. Enable HTTPS with SSL certificate
6. Consider adding:
   - Rate limiting
   - Request logging (morgan)
   - Error tracking (Sentry)
   - API documentation (Swagger)
