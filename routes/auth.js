const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const router = express.Router();

// Configure multer for profile pictures
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
}).single('profilePicture');

// Login
router.post('/login.php', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, message: 'Username and password are required' });
    }

    const [users] = await pool.query(
      'SELECT id, username, password, email, full_name, role, is_verified, profile_picture, student_id FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Set session
    req.session.user_id = user.id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.full_name = user.full_name;
    req.session.role = user.role;
    req.session.student_id = user.student_id;
    req.session.profile_picture = user.profile_picture;

    res.json({
      success: true,
      message: 'Login successful',
      role: user.role,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: 'Login failed' });
  }
});

// Signup
router.post('/signup.php', async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.json({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check existing username
    const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.json({ success: false, message: 'Username already exists' });
    }

    // Check existing email
    const [existingEmail] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      'INSERT INTO users (username, password, email, full_name, is_verified) VALUES (?, ?, ?, ?, 1)',
      [username, hashedPassword, email, fullName]
    );

    res.json({ success: true, message: 'Account created successfully! You can now login.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.json({ success: false, message: 'Registration failed' });
  }
});

// Check auth
router.get('/check-auth.php', (req, res) => {
  if (req.session.user_id) {
    res.json({
      authenticated: true,
      user_id: req.session.user_id,
      username: req.session.username,
      email: req.session.email,
      full_name: req.session.full_name,
      role: req.session.role,
      student_id: req.session.student_id,
      profile_picture: req.session.profile_picture
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Signup with picture
router.post('/signup-with-picture.php', (req, res) => {
  profileUpload(req, res, async (err) => {
    try {
      if (err) {
        console.error('Upload error:', err);
        return res.json({ success: false, message: err.message || 'File upload error' });
      }

      const { fullName, username, email, password, studentId } = req.body;

      console.log('Signup data:', { fullName, username, email, studentId, hasFile: !!req.file });

      if (!fullName || !username || !email || !password) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.json({ success: false, message: 'All fields are required' });
      }

      if (password.length < 6) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.json({ success: false, message: 'Password must be at least 6 characters' });
      }

      // Check existing username
      const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
      if (existingUser.length > 0) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.json({ success: false, message: 'Username already exists' });
      }

      // Check existing email
      const [existingEmail] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingEmail.length > 0) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.json({ success: false, message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const profilePicture = req.file ? req.file.filename : null;

      await pool.query(
        'INSERT INTO users (username, password, email, full_name, student_id, profile_picture, is_verified) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [username, hashedPassword, email, fullName, studentId || null, profilePicture]
      );

      res.json({ success: true, message: 'Account created successfully! You can now login.' });
    } catch (error) {
      console.error('Signup with picture error:', error);
      if (req.file) fs.unlinkSync(req.file.path);
      res.json({ success: false, message: 'Registration failed: ' + error.message });
    }
  });
});

// Logout
router.post('/logout.php', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;
