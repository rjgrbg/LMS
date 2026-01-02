require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function migrateData() {
  let connection;
  
  try {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'scosci1_lms',
      port: process.env.DB_PORT || 3306
    };

    console.log('═══════════════════════════════════════');
    console.log('  Data Migration Tool');
    console.log('═══════════════════════════════════════\n');

    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database\n');

    // Check if there's data to migrate
    const [materials] = await connection.query('SELECT COUNT(*) as count FROM materials');
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users WHERE role = "student"');

    console.log('Current data:');
    console.log(`  Materials: ${materials[0].count}`);
    console.log(`  Students: ${users[0].count}`);
    console.log(`  Admin: 1\n`);

    if (materials[0].count === 0 && users[0].count === 0) {
      console.log('⚠️  No data found to migrate.');
      console.log('\nYour uploads folder still has files:');
      console.log('  Location: uploads/');
      console.log('\nThe materials are physically there, but not in the database.');
      console.log('\nOptions:');
      console.log('1. Re-upload materials through admin panel');
      console.log('2. Or restore from a database backup if you have one\n');
    } else {
      console.log('✅ Data is already in the database!');
      console.log('\nIf you don\'t see it in the admin panel:');
      console.log('1. Make sure you\'re logged in as admin');
      console.log('2. Refresh the page (Ctrl+F5)');
      console.log('3. Check browser console for errors (F12)\n');
    }

    // Check uploads folder
    const fs = require('fs');
    const uploadsDir = 'uploads/';
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir).filter(f => f !== '.gitkeep');
      console.log(`📁 Files in uploads folder: ${files.length}`);
      if (files.length > 0) {
        console.log('\nFiles found:');
        files.slice(0, 5).forEach(f => console.log(`  - ${f}`));
        if (files.length > 5) {
          console.log(`  ... and ${files.length - 5} more`);
        }
      }
    }

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

migrateData();
