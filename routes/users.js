const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Configure multer for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'profile-pictures/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
    }
  }
});

// Get users (admin only)
router.get('/get-users.php', requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, role, student_id, created_at, last_login FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.json({ success: false, message: 'Failed to fetch users' });
  }
});

// Update profile
router.post('/update-profile.php', requireAuth, async (req, res) => {
  try {
    const { full_name, email, student_id } = req.body;
    const userId = req.session.user_id;

    await pool.query(
      'UPDATE users SET full_name = ?, email = ?, student_id = ? WHERE id = ?',
      [full_name, email, student_id, userId]
    );

    req.session.full_name = full_name;
    req.session.email = email;
    req.session.student_id = student_id;

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.json({ success: false, message: 'Update failed' });
  }
});

// Upload profile picture
router.post('/upload-profile-picture.php', requireAuth, upload.single('profile_picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.session.user_id;
    const filename = req.file.filename;

    // Delete old profile picture
    const [users] = await pool.query('SELECT profile_picture FROM users WHERE id = ?', [userId]);
    if (users[0].profile_picture) {
      const oldPath = path.join(__dirname, '..', 'profile-pictures', users[0].profile_picture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await pool.query('UPDATE users SET profile_picture = ? WHERE id = ?', [filename, userId]);
    req.session.profile_picture = filename;

    res.json({ success: true, message: 'Profile picture updated', filename });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.json({ success: false, message: 'Upload failed' });
  }
});

// Get dashboard stats
router.get('/get-dashboard-stats.php', requireAdmin, async (req, res) => {
  try {
    const [materials] = await pool.query('SELECT COUNT(*) as count FROM materials');
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "student"');
    const [downloads] = await pool.query('SELECT COUNT(*) as count FROM downloads');
    
    // Get recent students (this week)
    const [recentStudents] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role = "student" AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    
    // Get materials by type
    const [materialsByType] = await pool.query(
      'SELECT type, COUNT(*) as count FROM materials GROUP BY type'
    );
    
    // Get recent materials
    const [recentMaterials] = await pool.query(
      'SELECT id, title, type, file_name, upload_date FROM materials ORDER BY upload_date DESC LIMIT 5'
    );
    
    // Count by type
    const stats = {
      total_students: users[0].count,
      total_materials: materials[0].count,
      total_downloads: downloads[0].count,
      recent_students: recentStudents[0].count,
      lectures: 0,
      pdfs: 0,
      readings: 0,
      assignments: 0
    };
    
    // Map material types
    materialsByType.forEach(item => {
      const type = item.type.toLowerCase();
      if (type === 'lecture') stats.lectures = item.count;
      else if (type === 'pdf') stats.pdfs = item.count;
      else if (type === 'reading') stats.readings = item.count;
      else if (type === 'assignment') stats.assignments = item.count;
    });

    res.json({
      success: true,
      stats,
      recent_materials: recentMaterials
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.json({ success: false, message: 'Failed to fetch stats' });
  }
});

// Get statistics
router.get('/get-statistics.php', requireAdmin, async (req, res) => {
  try {
    const [materialsByType] = await pool.query(
      'SELECT type, COUNT(*) as count FROM materials GROUP BY type'
    );
    const [recentDownloads] = await pool.query(
      'SELECT d.download_date, m.title, u.username FROM downloads d JOIN materials m ON d.material_id = m.id LEFT JOIN users u ON d.user_id = u.id ORDER BY d.download_date DESC LIMIT 10'
    );

    res.json({
      success: true,
      materialsByType,
      recentDownloads
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.json({ success: false, message: 'Failed to fetch statistics' });
  }
});

module.exports = router;
