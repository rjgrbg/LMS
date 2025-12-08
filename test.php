<?php
echo "<h1>Server Test</h1>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Server Time: " . date('Y-m-d H:i:s') . "</p>";

echo "<h2>Environment Variables:</h2>";
echo "<pre>";
echo "DB_HOST: " . (getenv('DB_HOST') ?: $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? 'NOT SET') . "\n";
echo "DB_USER: " . (getenv('DB_USER') ?: $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? 'NOT SET') . "\n";
echo "DB_NAME: " . (getenv('DB_NAME') ?: $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? 'NOT SET') . "\n";
echo "DB_PORT: " . (getenv('DB_PORT') ?: $_ENV['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? 'NOT SET') . "\n";
echo "DB_PASS: " . (getenv('DB_PASS') || isset($_ENV['DB_PASS']) || isset($_SERVER['DB_PASS']) ? 'SET' : 'NOT SET') . "\n";
echo "</pre>";

echo "<h2>MySQLi Extension:</h2>";
echo "<p>" . (extension_loaded('mysqli') ? 'LOADED ✓' : 'NOT LOADED ✗') . "</p>";

if (extension_loaded('mysqli')) {
    echo "<h2>Database Connection Test:</h2>";
    $host = getenv('DB_HOST') ?: $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? 'localhost';
    $user = getenv('DB_USER') ?: $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? 'root';
    $pass = getenv('DB_PASS') ?: $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? '';
    $name = getenv('DB_NAME') ?: $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? 'scosci1_lms';
    $port = getenv('DB_PORT') ?: $_ENV['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? 3306;
    
    try {
        $conn = new mysqli($host, $user, $pass, $name, $port);
        
        if ($conn->connect_error) {
            echo "<p style='color:red'>Connection FAILED: " . $conn->connect_error . "</p>";
        } else {
            echo "<p style='color:green'>Connection SUCCESS ✓</p>";
            
            // Test query
            $result = $conn->query("SELECT COUNT(*) as count FROM users");
            if ($result) {
                $row = $result->fetch_assoc();
                echo "<p>Users in database: " . $row['count'] . "</p>";
                
                // Show sample users
                $result = $conn->query("SELECT username, email, role FROM users LIMIT 3");
                if ($result && $result->num_rows > 0) {
                    echo "<h3>Sample Users:</h3><ul>";
                    while ($user = $result->fetch_assoc()) {
                        echo "<li>" . htmlspecialchars($user['username']) . " (" . htmlspecialchars($user['email']) . ") - " . htmlspecialchars($user['role']) . "</li>";
                    }
                    echo "</ul>";
                }
            } else {
                echo "<p style='color:orange'>Query failed: " . $conn->error . "</p>";
            }
            
            $conn->close();
        }
    } catch (Exception $e) {
        echo "<p style='color:red'>Exception: " . $e->getMessage() . "</p>";
    }
}

echo "<hr>";
echo "<p><a href='index.html'>Go to Home</a> | <a href='login.html'>Go to Login</a> | <a href='signup.html'>Go to Signup</a></p>";
?>
