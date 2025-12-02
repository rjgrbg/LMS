<?php
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if profile_picture column exists
$result = $conn->query("SHOW COLUMNS FROM users LIKE 'profile_picture'");

if ($result->num_rows > 0) {
    echo json_encode([
        'success' => true,
        'message' => 'profile_picture column exists',
        'column_exists' => true
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'profile_picture column does NOT exist. Please run: ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL AFTER email;',
        'column_exists' => false
    ]);
}

$conn->close();
?>
