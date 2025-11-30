<?php
header('Content-Type: application/json');
require_once 'db-config.php';

try {
    // Test if classworks table exists
    $result = $conn->query("SELECT 1 FROM classworks LIMIT 1");
    
    if ($result === false) {
        echo json_encode([
            'success' => false,
            'message' => 'classworks table does not exist',
            'error' => $conn->error,
            'action' => 'Please run the SQL file: scosci1_lms_infinityfree.sql'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'classworks table exists!'
        ]);
    }
    
    // Test if classwork_submissions table exists
    $result2 = $conn->query("SELECT 1 FROM classwork_submissions LIMIT 1");
    
    if ($result2 === false) {
        echo json_encode([
            'success' => false,
            'message' => 'classwork_submissions table does not exist',
            'error' => $conn->error,
            'action' => 'Please run the SQL file: scosci1_lms_infinityfree.sql'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>
