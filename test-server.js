// Quick test to check if server starts without errors
require('dotenv').config();
const express = require('express');

console.log('Testing server configuration...\n');

// Test 1: Check environment variables
console.log('✓ Environment variables:');
console.log(`  DB_HOST: ${process.env.DB_HOST || 'localhost (default)'}`);
console.log(`  DB_NAME: ${process.env.DB_NAME || 'scosci1_lms (default)'}`);
console.log(`  PORT: ${process.env.PORT || '3000 (default)'}`);

// Test 2: Check if routes can be loaded
try {
  const authRoutes = require('./routes/auth');
  console.log('\n✓ Auth routes loaded successfully');
} catch (error) {
  console.error('\n✗ Error loading auth routes:', error.message);
  process.exit(1);
}

try {
  const materialsRoutes = require('./routes/materials');
  console.log('✓ Materials routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading materials routes:', error.message);
  process.exit(1);
}

try {
  const usersRoutes = require('./routes/users');
  console.log('✓ Users routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading users routes:', error.message);
  process.exit(1);
}

// Test 3: Check database connection
const pool = require('./config/db');
pool.getConnection()
  .then(connection => {
    console.log('\n✓ Database connection successful');
    connection.release();
    console.log('\n✅ All tests passed! Server is ready to start.');
    console.log('\nRun: npm start');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n✗ Database connection failed:', err.message);
    console.error('\nMake sure:');
    console.error('1. MySQL is running in XAMPP');
    console.error('2. Database exists: npm run setup');
    process.exit(1);
  });
