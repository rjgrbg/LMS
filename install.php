<?php
// One-time database setup script
// Visit: https://your-app.onrender.com/install.php

require_once 'api/db-config.php';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Database Setup - SCOSCI1 LMS</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { color: blue; background: #d1ecf1; padding: 10px; border-radius: 5px; margin: 10px 0; }
        h1 { color: #4CAF50; }
        .btn { background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🚀 SCOSCI1 LMS - Database Setup</h1>
    
<?php
try {
    $conn = getDBConnection();
    echo "<div class='success'>✅ Connected to database successfully!</div>";
    
    // Create users table
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role ENUM('student', 'admin') DEFAULT 'student',
        is_verified TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_username (username),
        INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->query($sql)) {
        echo "<div class='success'>✅ Users table created successfully!</div>";
    } else {
        echo "<div class='error'>❌ Error creating users table: " . $conn->error . "</div>";
    }
    
    // Create materials table
    $sql = "CREATE TABLE IF NOT EXISTS materials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50),
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_data LONGBLOB,
        file_size INT,
        mime_type VARCHAR(100),
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_upload_date (upload_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    
    if ($conn->query($sql)) {
        echo "<div class='success'>✅ Materials table created successfully!</div>";
    } else {
        echo "<div class='error'>❌ Error creating materials table: " . $conn->error . "</div>";
    }
    
    // Create admin user (password: password)
    $adminPassword = password_hash('password', PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (username, password, email, full_name, role, is_verified) 
            VALUES ('admin', '$adminPassword', 'admin@scosci1.edu', 'Administrator', 'admin', 1)
            ON DUPLICATE KEY UPDATE username=username";
    
    if ($conn->query($sql)) {
        if ($conn->affected_rows > 0) {
            echo "<div class='success'>✅ Admin user created successfully!</div>";
        } else {
            echo "<div class='info'>ℹ️ Admin user already exists</div>";
        }
    } else {
        echo "<div class='error'>❌ Error creating admin user: " . $conn->error . "</div>";
    }
    
    echo "<hr>";
    echo "<h2>🎉 Setup Complete!</h2>";
    echo "<div class='info'>";
    echo "<strong>Admin Login Credentials:</strong><br>";
    echo "Username: <code>admin</code><br>";
    echo "Password: <code>password</code><br><br>";
    echo "<strong>⚠️ IMPORTANT:</strong> Change the admin password after first login!";
    echo "</div>";
    
    echo "<a href='index.html' class='btn'>Go to Homepage</a> ";
    echo "<a href='login.html' class='btn'>Login Now</a>";
    
    echo "<hr>";
    echo "<div class='error'><strong>🔒 Security Notice:</strong> Delete this file (install.php) immediately after setup!</div>";
    
    closeDBConnection($conn);
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Database Error: " . $e->getMessage() . "</div>";
    echo "<div class='info'>Please check your database connection settings in api/db-config.php</div>";
}
?>

</body>
</html>
