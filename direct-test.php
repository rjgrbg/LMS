<?php
// Direct connection test - bypasses db-config.php
echo "<h1>Direct Database Connection Test</h1>";

// Get environment variables
$host = getenv('DB_HOST') ?: $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? 'NOT SET';
$user = getenv('DB_USER') ?: $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? 'NOT SET';
$pass = getenv('DB_PASS') ?: $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? 'NOT SET';
$name = getenv('DB_NAME') ?: $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? 'NOT SET';
$port = getenv('DB_PORT') ?: $_ENV['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? 3306;

echo "<h2>Environment Variables:</h2>";
echo "<pre>";
echo "DB_HOST: $host\n";
echo "DB_USER: $user\n";
echo "DB_NAME: $name\n";
echo "DB_PORT: $port\n";
echo "DB_PASS: " . ($pass !== 'NOT SET' ? 'SET (hidden)' : 'NOT SET') . "\n";
echo "</pre>";

echo "<h2>MySQLi Extension:</h2>";
echo "<p>" . (extension_loaded('mysqli') ? '✓ LOADED' : '✗ NOT LOADED') . "</p>";

if ($host === 'NOT SET') {
    echo "<p style='color:red;'><strong>ERROR: Environment variables are NOT SET!</strong></p>";
    echo "<p>Make sure you set DB_HOST, DB_USER, DB_PASS, DB_NAME in Render dashboard.</p>";
    exit;
}

echo "<h2>Connection Test:</h2>";

try {
    $conn = new mysqli($host, $user, $pass, $name, $port);
    
    if ($conn->connect_error) {
        echo "<p style='color:red;'><strong>CONNECTION FAILED:</strong> " . $conn->connect_error . "</p>";
        echo "<p>Error code: " . $conn->connect_errno . "</p>";
    } else {
        echo "<p style='color:green;'><strong>✓ CONNECTION SUCCESS!</strong></p>";
        
        // Test query
        $result = $conn->query("SELECT COUNT(*) as count FROM users");
        if ($result) {
            $row = $result->fetch_assoc();
            echo "<p><strong>Users in database:</strong> " . $row['count'] . "</p>";
            
            if ($row['count'] > 0) {
                // Show sample users
                $result = $conn->query("SELECT username, email, role FROM users LIMIT 5");
                echo "<h3>Sample Users:</h3><ul>";
                while ($user = $result->fetch_assoc()) {
                    echo "<li>" . htmlspecialchars($user['username']) . " (" . htmlspecialchars($user['email']) . ") - Role: " . htmlspecialchars($user['role']) . "</li>";
                }
                echo "</ul>";
            } else {
                echo "<p style='color:orange;'><strong>WARNING:</strong> Database is empty! No users found.</p>";
                echo "<p>You need to import your scosci1_lms.sql file to Clever Cloud.</p>";
            }
        } else {
            echo "<p style='color:orange;'><strong>Query failed:</strong> " . $conn->error . "</p>";
        }
        
        $conn->close();
    }
} catch (Exception $e) {
    echo "<p style='color:red;'><strong>EXCEPTION:</strong> " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><a href='login.html'>Try Login</a> | <a href='signup.html'>Try Signup</a></p>";
?>
