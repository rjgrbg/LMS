const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `material_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.pdf', '.ppt', '.pptx', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PPT, PPTX, DOC, and DOCX files are allowed.'));
    }
  }
});

// Get all materials
router.get('/get-materials.php', async (req, res) => {
  try {
    const [materials] = await pool.query(
      'SELECT id, title, description, type, file_name, file_path, upload_date FROM materials ORDER BY upload_date DESC'
    );
    res.json({ success: true, materials });
  } catch (error) {
    console.error('Get materials error:', error);
    res.json({ success: false, message: 'Failed to fetch materials', materials: [] });
  }
});

// Upload material
router.post('/upload-material.php', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, description, type } = req.body;

    if (!title || !description || !type) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.json({ success: false, message: 'All fields are required' });
    }

    if (!req.file) {
      return res.json({ success: false, message: 'No file was selected' });
    }

    const [result] = await pool.query(
      'INSERT INTO materials (title, description, type, file_name, file_path, file_size, mime_type, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [title, description, type, req.file.originalname, req.file.filename, req.file.size, req.file.mimetype]
    );

    res.json({ success: true, message: 'Material uploaded successfully!', material_id: result.insertId });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.json({ success: false, message: 'Upload failed' });
  }
});

// Download material
router.get('/download-material.php', async (req, res) => {
  try {
    const { id } = req.query;
    const [materials] = await pool.query('SELECT file_name, file_path FROM materials WHERE id = ?', [id]);

    if (materials.length === 0) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    const material = materials[0];
    const filePath = path.join(__dirname, '..', 'uploads', material.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.download(filePath, material.file_name);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: 'Download failed' });
  }
});

// Delete material
router.delete('/delete-material.php', requireAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    const [materials] = await pool.query('SELECT file_path FROM materials WHERE id = ?', [id]);

    if (materials.length > 0) {
      const filePath = path.join(__dirname, '..', 'uploads', materials[0].file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pool.query('DELETE FROM materials WHERE id = ?', [id]);
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.json({ success: false, message: 'Delete failed' });
  }
});

// Update material
router.put('/update-material.php', requireAdmin, async (req, res) => {
  try {
    const { id, title, description, type } = req.body;

    await pool.query(
      'UPDATE materials SET title = ?, description = ?, type = ? WHERE id = ?',
      [title, description, type, id]
    );

    res.json({ success: true, message: 'Material updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.json({ success: false, message: 'Update failed' });
  }
});

module.exports = router;
