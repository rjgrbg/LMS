-- Create database
CREATE DATABASE IF NOT EXISTS scosci1_lms;
USE scosci1_lms;

-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_upload_date (upload_date),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Create users table for future authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'student') DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Create downloads tracking table
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

-- Insert sample admin user (password: admin123)
-- Note: In production, use proper password hashing with password_hash()
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@scosci1.edu', 'admin');

-- Insert sample materials (optional)
INSERT INTO materials (title, description, type, file_name, file_path) VALUES 
('Lecture 1: Introduction to Contemporary Issues', 'A brief overview of contemporary issues discussing various trends.', 'Lecture', 'lecture1.pdf', 'sample_lecture1.pdf'),
('Lecture 2: Global Political Issues', 'An in-depth analysis of global political controversies.', 'Lecture', 'lecture2.pdf', 'sample_lecture2.pdf'),
('PPT on Sustainability', 'Understanding sustainability in the modern world.', 'PPT', 'sustainability.pptx', 'sample_sustainability.pptx'),
('PDF on Societal Challenges', 'A comprehensive guide on current societal challenges.', 'PDF', 'societal_challenges.pdf', 'sample_societal.pdf');