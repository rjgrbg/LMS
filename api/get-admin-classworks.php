<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    // Get all classworks with submission counts
    $stmt = $conn->prepare("
        SELECT 
            c.*,
            COUNT(DISTINCT s.id) as total_submissions,
            COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_count,
            (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students
        FROM classworks c
        LEFT JOIN classwork_submissions s ON c.id = s.classwork_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
    ");
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $classworks = [];
    while ($row = $result->fetch_assoc()) {
        $classworks[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'classworks' => $classworks
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
