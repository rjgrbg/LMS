<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Test database connection
echo json_encode([
    'test' => 'Database Connection Test',
    'env_vars' => [
        'DB_HOST' => getenv('DB_HOST') ?: 'not set',
        'DB_USER' => getenv('DB_USER') ?: 'not set',
        'DB_NAME' => getenv('DB_NAME') ?: 'not set',
        'DB_PORT' => getenv('DB_PORT') ?: 'not set',
        'DB_PASS' => getenv('DB_PASS') ? 'set (hidden)' : 'not set'
    ]
]);

require_once 'db-config.php';

try {
    $conn = getDBConnection();
    
    // Test query
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    if ($result) {
        $row = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'message' => 'Database connected successfully!',
            'user_count' => $row['count']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Connected but query failed',
            'error' => $conn->error
        ]);
    }
    
    closeDBConnection($conn);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Connection failed',
        'error' => $e->getMessage()
    ]);
}
?>
