# 🚀 Quick Start Guide

## Step 1: Start MySQL
Open **XAMPP Control Panel** and click **Start** next to MySQL

## Step 2: Setup Database (Choose One)

### Option A: Automated (Easiest) ⭐
```bash
npm run setup
```
This creates everything automatically!

### Option B: Manual
```bash
node create-admin.js
```

## Step 3: Start Server
```bash
npm start
```

## Step 4: Login
Open browser to: **http://localhost:3000/login.html**

**Credentials:**
- Username: `admin`
- Password: `admin123`

---

## ✅ All Fixed Issues

### 1. Logout Now Works!
- Click burger menu (☰)
- Click "Logout"
- Session properly cleared
- Redirects to homepage

### 2. Database Setup Easy
- Run `npm run setup` - done!
- Or use `npm run create-admin`
- Clear error messages if something fails

### 3. Admin Login Works
- Password hash compatible with Node.js
- No more "invalid credentials" error

---

## 🔧 Troubleshooting

**"Cannot connect to database"**
- Start MySQL in XAMPP Control Panel
- Check .env file has correct credentials

**"Port 3000 already in use"**
- Change PORT in .env to 3001
- Or stop other app using port 3000

**"Admin login still fails"**
- Run: `npm run setup` again
- This recreates admin with correct password

---

## 📁 Project Structure

```
├── server.js              # Main server
├── package.json           # Dependencies
├── .env                   # Configuration
├── setup-database.js      # Database setup script ⭐
├── create-admin.js        # Admin creation script
├── config/
│   └── db.js             # Database connection
├── routes/
│   ├── auth.js           # Login, logout, signup
│   ├── materials.js      # Materials management
│   └── users.js          # User management
├── middleware/
│   └── auth.js           # Auth guards
├── public/               # Frontend files
│   ├── index.html
│   ├── login.html
│   ├── admin.html
│   └── ...
├── uploads/              # Uploaded materials
└── profile-pictures/     # User avatars
```

---

## 🎯 Features Working

✅ User login/logout  
✅ Admin panel  
✅ Upload materials (PDF, PPT, DOC)  
✅ Download materials  
✅ Download all as ZIP  
✅ Profile management  
✅ Profile pictures  
✅ Search materials  
✅ Filter by type  
✅ User statistics  

---

## 🔐 Security Notes

**Important:** Change admin password after first login!

1. Login as admin
2. Go to profile settings
3. Change password
4. Or update directly in database

---

## 📞 Need Help?

Check these files:
- `FIXED-ISSUES.md` - What was fixed
- `README.md` - Full documentation
- `QUICK-START.md` - Setup guide

**Common Commands:**
```bash
npm start          # Start server
npm run dev        # Start with auto-reload
npm run setup      # Setup database
npm run create-admin  # Create admin user
```

---

**You're all set! 🎉**
