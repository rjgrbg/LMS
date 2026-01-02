# ✅ Error Fixed - Signup with Picture

## The Problem
When trying to sign up, the browser showed:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
api/signup-with-picture.php
```

## Root Causes

### 1. Multer Configuration Inside Route Handler
The multer middleware was being created inside the route handler, which caused it to not work properly.

### 2. Field Name Mismatch
- Frontend was sending: `profilePicture`
- Backend was expecting: `profile_picture`

### 3. Missing Dependencies
The route was requiring multer, path, and fs inside the handler instead of at the top.

## The Fix

### 1. Moved Multer Configuration to Top Level
```javascript
// At the top of routes/auth.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'profile-pictures/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const profileUpload = multer({ 
  storage: profileStorage, 
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
}).single('profilePicture'); // Changed to match frontend
```

### 2. Fixed Field Name
Changed from `profile_picture` to `profilePicture` to match what the frontend sends.

### 3. Simplified Route Handler
```javascript
router.post('/signup-with-picture.php', (req, res) => {
  profileUpload(req, res, async (err) => {
    // Handle upload and signup
  });
});
```

### 4. Added Student ID Support
Now properly handles the `studentId` field from the signup form.

## Testing

Run the test to verify everything works:
```bash
npm test
```

Expected output:
```
✓ Environment variables
✓ Auth routes loaded successfully
✓ Materials routes loaded successfully
✓ Users routes loaded successfully
✓ Database connection successful
✅ All tests passed!
```

## How to Use

1. **Start MySQL** in XAMPP Control Panel

2. **Setup database** (if not done):
   ```bash
   npm run setup
   ```

3. **Start server**:
   ```bash
   npm start
   ```

4. **Test signup**:
   - Go to http://localhost:3000/signup.html
   - Fill in all fields
   - Optionally upload a profile picture
   - Click "Create Account"
   - Should redirect to login page

5. **Login**:
   - Use your new credentials
   - Or use admin: `admin` / `admin123`

## What's Working Now

✅ Signup without profile picture  
✅ Signup with profile picture  
✅ Student ID field  
✅ Email validation  
✅ Password validation  
✅ Duplicate username/email check  
✅ Proper error messages  
✅ File size limits (5MB for images)  
✅ File type validation (JPG, PNG, GIF)  

## Additional Improvements

1. **Better Error Handling**
   - Clear error messages for each validation
   - File cleanup on error
   - Proper HTTP status codes

2. **Security**
   - File type validation
   - File size limits
   - Password hashing with bcrypt
   - SQL injection prevention with prepared statements

3. **User Experience**
   - Loading spinner during signup
   - Clear success/error messages
   - Form validation before submission

## Troubleshooting

**"Cannot POST /api/signup-with-picture.php"**
- Make sure server is running: `npm start`
- Check console for errors

**"File upload error"**
- Check profile-pictures folder exists
- Check file size (max 5MB)
- Check file type (JPG, PNG, GIF only)

**"Database error"**
- Run: `npm run setup`
- Check MySQL is running

**Still having issues?**
- Run: `npm test` to diagnose
- Check server console for errors
- Check browser console for errors
