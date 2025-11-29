<?php
header('Content-Type: application/json');
require_once 'db-config.php';

try {
    $conn = getDBConnection();
    echo json_encode([
        'success' => true, 
        'message' => 'Database connection successful!',
        'database' => DB_NAME,
        'host' => DB_HOST
    ]);
    closeDBConnection($conn);
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Connection failed: ' . $e->getMessage()
    ]);
}
?>
