<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = [
    'test' => 'Database Connection Test',
    'env_vars' => [
        'DB_HOST' => getenv('DB_HOST') ?: 'not set',
        'DB_USER' => getenv('DB_USER') ?: 'not set',
        'DB_NAME' => getenv('DB_NAME') ?: 'not set',
        'DB_PORT' => getenv('DB_PORT') ?: 'not set',
        'DB_PASS' => getenv('DB_PASS') ? 'set (hidden)' : 'not set'
    ]
];

try {
    require_once 'db-config.php';
    $conn = getDBConnection();
    
    // Test query
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    if ($result) {
        $row = $result->fetch_assoc();
        $response['success'] = true;
        $response['message'] = 'Database connected successfully!';
        $response['user_count'] = $row['count'];
    } else {
        $response['success'] = false;
        $response['message'] = 'Connected but query failed';
        $response['error'] = $conn->error;
    }
    
    closeDBConnection($conn);
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Connection failed';
    $response['error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
