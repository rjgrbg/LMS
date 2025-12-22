# Quick Start Guide

## Installation (Windows)

### Method 1: Automated (Recommended)
Double-click `install.bat` and follow the prompts.

### Method 2: Manual
```bash
# Install dependencies
npm install

# Create directories
mkdir uploads
mkdir profile-pictures
```

## Configuration

1. Edit `.env` file:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=scosci1_lms
DB_PORT=3306
SESSION_SECRET=change-this-to-random-string
```

2. Import database:
```bash
mysql -u root -p scosci1_lms < scosci1_lms.sql
```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Access

- **URL**: http://localhost:3000
- **Admin Login**:
  - Username: `admin`
  - Password: `admin123`

## Testing

1. Login as admin
2. Upload a material (PDF, PPT, DOC)
3. View materials on homepage
4. Download a material
5. Create a student account
6. Test student features

## Common Issues

**"Cannot find module"**
```bash
npm install
```

**"Port 3000 already in use"**
- Change PORT in `.env` to 3001 or another port

**"Database connection failed"**
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists

**"EACCES: permission denied"**
```bash
# Windows: Run as Administrator
# Or change folder permissions
```

## Project Structure

```
scosci1-lms/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Configuration
├── config/
│   └── db.js             # Database connection
├── routes/
│   ├── auth.js           # Login, signup, logout
│   ├── materials.js      # Upload, download, delete
│   └── users.js          # Profile, users management
├── middleware/
│   └── auth.js           # Authentication checks
├── public/               # Frontend files
│   ├── index.html
│   ├── login.html
│   ├── admin.html
│   └── ...
├── uploads/              # Uploaded materials
└── profile-pictures/     # User avatars
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## Next Steps

1. ✅ Install and run the application
2. ✅ Login and test features
3. 📝 Change admin password
4. 📝 Update SESSION_SECRET in `.env`
5. 🚀 Deploy to production server

## Need Help?

Check these files:
- `README.md` - Full documentation
- `MIGRATION-GUIDE.md` - PHP to Node.js migration details
- `package.json` - Dependencies and scripts

## Production Deployment

For production, consider:
- Use PM2 process manager
- Set up nginx reverse proxy
- Enable HTTPS
- Use environment variables for secrets
- Set up database backups
- Monitor with logging tools

Quick PM2 setup:
```bash
npm install -g pm2
pm2 start server.js --name scosci1-lms
pm2 startup
pm2 save
```
