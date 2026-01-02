require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  let connection;
  
  try {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    };

    console.log('═══════════════════════════════════════');
    console.log('  SCOSCI1 LMS - Database Setup');
    console.log('═══════════════════════════════════════\n');
    console.log(`Connecting to MySQL...`);
    console.log(`Host: ${config.host}`);
    console.log(`User: ${config.user}\n`);

    // Connect without database first
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server\n');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'scosci1_lms';
    console.log(`Creating database "${dbName}" if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log('✅ Database ready\n');

    // Use the database
    await connection.query(`USE \`${dbName}\``);

    // Create tables
    console.log('Creating tables...');

    // Materials table
    await connection.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('  ✓ Materials table');

    // Users table
    await connection.query(`
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
        student_id VARCHAR(50),
        profile_picture VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('  ✓ Users table');

    // Downloads table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        material_id INT NOT NULL,
        user_id INT,
        download_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_material_id (material_id),
        INDEX idx_download_date (download_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('  ✓ Downloads table\n');

    // Create admin user
    console.log('Creating admin user...');
    
    // Delete existing admin if exists
    await connection.query('DELETE FROM users WHERE username = ?', ['admin']);

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert admin
    await connection.query(
      'INSERT INTO users (username, password, email, full_name, role, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
      ['admin', hashedPassword, 'admin@scosci1.edu', 'System Administrator', 'admin', 1]
    );
    console.log('  ✓ Admin user created\n');

    console.log('═══════════════════════════════════════');
    console.log('  ✅ Database setup completed!');
    console.log('═══════════════════════════════════════\n');
    console.log('Admin Credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123\n');
    console.log('Next steps:');
    console.log('  1. Run: npm start');
    console.log('  2. Open: http://localhost:3000');
    console.log('  3. Login with admin credentials\n');

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MySQL is running in XAMPP Control Panel');
    console.error('2. Check your .env file has correct credentials');
    console.error('3. Try running XAMPP as Administrator\n');
    
    if (connection) await connection.end();
    process.exit(1);
  }
}

setupDatabase();
