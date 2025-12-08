<?php
header('Content-Type: application/json');

// Simple test to check if environment variables are set
$response = [
    'test' => 'Environment Variables Test',
    'php_version' => phpversion(),
    'env_vars' => [
        'DB_HOST' => getenv('DB_HOST') ?: 'NOT SET',
        'DB_USER' => getenv('DB_USER') ?: 'NOT SET',
        'DB_NAME' => getenv('DB_NAME') ?: 'NOT SET',
        'DB_PORT' => getenv('DB_PORT') ?: 'NOT SET',
        'DB_PASS' => getenv('DB_PASS') ? 'SET (hidden)' : 'NOT SET'
    ],
    'mysqli_available' => extension_loaded('mysqli') ? 'YES' : 'NO'
];

// Try direct connection without db-config.php
if (getenv('DB_HOST')) {
    try {
        $conn = new mysqli(
            getenv('DB_HOST'),
            getenv('DB_USER'),
            getenv('DB_PASS'),
            getenv('DB_NAME'),
            getenv('DB_PORT') ?: 3306
        );
        
        if ($conn->connect_error) {
            $response['connection'] = 'FAILED';
            $response['error'] = $conn->connect_error;
        } else {
            $response['connection'] = 'SUCCESS';
            $result = $conn->query("SELECT COUNT(*) as count FROM users");
            if ($result) {
                $row = $result->fetch_assoc();
                $response['user_count'] = $row['count'];
            }
            $conn->close();
        }
    } catch (Exception $e) {
        $response['connection'] = 'EXCEPTION';
        $response['error'] = $e->getMessage();
    }
} else {
    $response['connection'] = 'ENV VARS NOT SET';
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
