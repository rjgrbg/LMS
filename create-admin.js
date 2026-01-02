require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createAdmin() {
  try {
    // Use defaults if env vars are not set
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'scosci1_lms',
      port: process.env.DB_PORT || 3306
    };

    console.log('Connecting to database...');
    console.log(`Host: ${config.host}`);
    console.log(`Database: ${config.database}`);
    console.log(`User: ${config.user}`);

    const connection = await mysql.createConnection(config);

    console.log('✅ Connected to database successfully!');

    // Hash the password with bcryptjs (same as used in Node.js app)
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating/updating admin user...');

    // Delete existing admin if exists
    await connection.query('DELETE FROM users WHERE username = ?', ['admin']);

    // Insert new admin with correct bcrypt hash
    await connection.query(
      'INSERT INTO users (username, password, email, full_name, role, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
      ['admin', hashedPassword, 'admin@scosci1.edu', 'System Administrator', 'admin', 1]
    );

    console.log('\n✅ Admin account created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('═══════════════════════════════════════');
    console.log('\nYou can now login at http://localhost:3000/login.html');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MySQL is running (start it in XAMPP Control Panel)');
    console.error('2. Check that database "scosci1_lms" exists');
    console.error('3. Verify credentials in .env file');
    console.error('4. Run: mysql -u root -p scosci1_lms < scosci1_lms_nodejs.sql');
    process.exit(1);
  }
}

createAdmin();
