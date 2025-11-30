-- Modified SQL for InfinityFree Import
-- DO NOT include CREATE DATABASE or USE commands
-- InfinityFree will automatically use the selected database

-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_data LONGBLOB,
    file_size INT,
    mime_type VARCHAR(100),
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_upload_date (upload_date),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create users table with email verification
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    is_verified TINYINT(1) DEFAULT 0,
    verification_code VARCHAR(6),
    verification_expires DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create downloads tracking table
CREATE TABLE IF NOT EXISTS downloads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL,
    user_id INT,
    download_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_material_id (material_id),
    INDEX idx_download_date (download_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert or update default admin user (username: admin, password: admin123)
-- If admin exists, update the password
INSERT INTO users (username, password, email, full_name, role, is_verified) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@scosci1.edu', 'System Administrator', 'admin', 1)
ON DUPLICATE KEY UPDATE 
    password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role = 'admin',
    is_verified = 1;

-- Classwork System Tables

-- Table for classwork assignments
CREATE TABLE IF NOT EXISTS classworks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    due_date DATETIME NOT NULL,
    max_score INT DEFAULT 100,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'closed') DEFAULT 'active',
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table for student submissions
CREATE TABLE IF NOT EXISTS classwork_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classwork_id INT NOT NULL,
    student_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INT DEFAULT NULL,
    feedback TEXT DEFAULT NULL,
    status ENUM('submitted', 'graded', 'late') DEFAULT 'submitted',
    FOREIGN KEY (classwork_id) REFERENCES classworks(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_submission (classwork_id, student_id),
    INDEX idx_student (student_id),
    INDEX idx_classwork (classwork_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
