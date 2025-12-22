const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const router = express.Router();

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

// Logout
router.post('/logout.php', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;
