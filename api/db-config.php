<?php
// Database configuration for Render + Clever Cloud
// Uses environment variables set in Render dashboard
// For local development, falls back to localhost
// Try multiple methods to get environment variables (Docker compatibility)
define('DB_HOST', getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? ($_SERVER['DB_HOST'] ?? 'localhost')));
define('DB_USER', getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? ($_SERVER['DB_USER'] ?? 'root')));
define('DB_PASS', getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? ($_SERVER['DB_PASS'] ?? '')));
define('DB_NAME', getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? ($_SERVER['DB_NAME'] ?? 'scosci1_lms')));
define('DB_PORT', getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? ($_SERVER['DB_PORT'] ?? 3306)));

// Create connection immediately
try {
    $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    
    // Check if connection was successful
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Set charset to utf8mb4
    if (!$conn->set_charset("utf8mb4")) {
        throw new Exception("Error setting charset: " . $conn->error);
    }
} catch (Exception $e) {
    error_log("Database connection error: " . $e->getMessage());
    http_response_code(500);
    if (headers_sent() === false) {
        header('Content-Type: application/json');
    }
    echo json_encode([
        'success' => false, 
        'message' => 'Database connection failed',
        'details' => $e->getMessage()
    ]);
    exit;
}

// Helper function for getting connection (for compatibility)
function getDBConnection() {
    global $conn;
    return $conn;
}

// Close connection
function closeDBConnection($conn) {
    if ($conn) {
        $conn->close();
    }
}
?>