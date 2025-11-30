# 🎓 Classwork System - Complete Setup Guide

## ✅ System Overview

A complete classwork management system with:
- **Admin**: Create assignments, view submissions, grade work
- **Students**: View assignments, submit work, check grades
- **Features**: File uploads, automatic late detection, grading with feedback

---

## 📋 Step 1: Database Setup

### Run the SQL file to create tables:

```sql
-- Execute this file in your database
-- File: classwork_tables.sql
```

This creates:
- `classworks` - Stores assignments
- `classwork_submissions` - Stores student submissions with grades

### Verify tables were created:
```sql
SHOW TABLES LIKE 'classwork%';
```

You should see:
- classworks
- classwork_submissions

---

## 📁 Step 2: Create Submissions Folder

Create a folder named `submissions` in your root directory:

```
your-project/
├── uploads/          (existing)
├── submissions/      ← CREATE THIS
├── api/
├── index.html
└── ...
```

**Important**: Make sure this folder has write permissions (777 on Linux/Mac)

---

## 🔧 Step 3: Files Created

### Frontend Files:
✅ `classwork.html` - Student classwork page
✅ `classwork-script.js` - Student functionality
✅ `admin-classwork-script.js` - Admin functionality

### Backend API Files:
✅ `api/get-classworks.php` - Get assignments for students
✅ `api/submit-classwork.php` - Submit student work
✅ `api/get-submission-feedback.php` - Get grades/feedback
✅ `api/create-classwork.php` - Create new assignment (admin)
✅ `api/get-admin-classworks.php` - Get all assignments (admin)
✅ `api/get-classwork-submissions.php` - Get submissions (admin)
✅ `api/grade-submission.php` - Grade submissions (admin)
✅ `api/download-submission.php` - Download student files (admin)
✅ `api/delete-classwork.php` - Delete assignment (admin)

### Updated Files:
✅ `admin.html` - Added classwork section
✅ `script.js` - Added classwork link to student menu
✅ `style.css` - Added classwork styles

---

## 🎯 Step 4: How to Use

### For Admins:

1. **Login as admin**
2. **Go to Admin Panel** (burger menu → Admin Panel)
3. **Click "Classwork"** in the burger menu
4. **Create Assignment:**
   - Enter title (e.g., "Essay on Globalization")
   - Set due date and time
   - Set maximum score (default: 100)
   - Write instructions
   - Click "Create Classwork"

5. **View Submissions:**
   - Click "View Submissions" on any assignment
   - See all student submissions
   - Download submitted files
   - Grade each submission

6. **Grade Work:**
   - Click "Grade" button on a submission
   - Enter score (0 to max score)
   - Add feedback (optional)
   - Click "Submit Grade"

### For Students:

1. **Login as student**
2. **Click burger menu → Classwork**
3. **View Assignments:**
   - See all active assignments
   - Check due dates and points
   - View submission status

4. **Submit Work:**
   - Click "Submit Work" on pending assignment
   - Upload your file (PDF, DOC, DOCX, PPT, PPTX, ZIP)
   - Max file size: 50MB
   - Click "Submit Work"

5. **Check Grades:**
   - Graded assignments show score
   - Click "View Feedback" to see teacher comments

---

## 📊 Features

### Student Features:
- ✅ View all active assignments
- ✅ See due dates and point values
- ✅ Submit work (one submission per assignment)
- ✅ Automatic late detection
- ✅ View grades and feedback
- ✅ Filter by status (All, Pending, Submitted, Graded)
- ✅ Search assignments
- ✅ Track statistics (total, submitted, average score)

### Admin Features:
- ✅ Create unlimited assignments
- ✅ Set custom due dates and scores
- ✅ View all student submissions
- ✅ Download submitted files
- ✅ Grade with scores and feedback
- ✅ Edit grades after submission
- ✅ Track submission rates
- ✅ Delete assignments (with all submissions)

### Security Features:
- ✅ Authentication required
- ✅ Role-based access (admin/student)
- ✅ File type validation
- ✅ File size limits
- ✅ SQL injection prevention
- ✅ Unique submission constraint

---

## 🗂️ Database Schema

### classworks table:
```sql
- id (INT, PRIMARY KEY)
- title (VARCHAR 255)
- description (TEXT)
- due_date (DATETIME)
- max_score (INT, default 100)
- created_by (INT, FOREIGN KEY → users.id)
- created_at (TIMESTAMP)
- status (ENUM: 'active', 'closed')
```

### classwork_submissions table:
```sql
- id (INT, PRIMARY KEY)
- classwork_id (INT, FOREIGN KEY → classworks.id)
- student_id (INT, FOREIGN KEY → users.id)
- file_path (VARCHAR 500)
- file_name (VARCHAR 255)
- submitted_at (TIMESTAMP)
- score (INT, nullable)
- feedback (TEXT, nullable)
- status (ENUM: 'submitted', 'graded', 'late')
- UNIQUE(classwork_id, student_id)
```

---

## 🔍 Testing the System

### Test as Admin:
1. Login as admin
2. Create a test assignment
3. Set due date to tomorrow
4. Set max score to 50

### Test as Student:
1. Login as student
2. Go to Classwork page
3. See the assignment you created
4. Submit a test file
5. Check submission status

### Test Grading:
1. Login as admin again
2. Go to Classwork section
3. Click "View Submissions"
4. Grade the student's work
5. Add feedback

### Verify Student Sees Grade:
1. Login as student
2. Go to Classwork
3. See "Graded" status
4. Click "View Feedback"

---

## 🚨 Troubleshooting

### Issue: "Submissions folder not found"
**Solution**: Create `submissions` folder in root directory with write permissions

### Issue: "File upload failed"
**Solution**: 
- Check folder permissions (chmod 777 submissions)
- Check PHP upload_max_filesize in php.ini
- Check post_max_size in php.ini

### Issue: "Can't see classwork menu"
**Solution**: 
- Clear browser cache
- Make sure you're logged in
- Check if scripts are loaded (F12 → Console)

### Issue: "Database error"
**Solution**:
- Run classwork_tables.sql
- Check database connection in db-config.php
- Verify tables exist: `SHOW TABLES;`

---

## 📱 Navigation Structure

### Student Menu (Burger):
- Materials (index.html)
- **Classwork (classwork.html)** ← NEW
- Logout

### Admin Menu (Burger):
- Students
- Materials
- **Classwork** ← NEW
- Homepage
- Logout

---

## 🎨 UI Features

- Responsive design (works on mobile, tablet, desktop)
- Status badges (Pending, Submitted, Graded, Late)
- Color-coded indicators
- Real-time statistics
- Loading states
- Error handling
- Success notifications

---

## 📈 Statistics Tracked

### For Students:
- Total assignments
- Submitted count
- Average score

### For Admins:
- Total submissions per assignment
- Submission rate (%)
- Graded count
- Due dates

---

## 🔐 Security Notes

- All endpoints check authentication
- Admin-only endpoints verify role
- File uploads validated (type & size)
- SQL injection prevented (prepared statements)
- One submission per student per assignment
- Files stored outside web root (recommended)

---

## ✨ Success!

Your classwork system is now ready! Students can submit work and admins can grade it with feedback. The system automatically tracks late submissions and calculates statistics.

**Need help?** Check the console (F12) for error messages.
