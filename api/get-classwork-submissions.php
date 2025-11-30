<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$classwork_id = $_GET['classwork_id'] ?? null;

if (!$classwork_id) {
    echo json_encode(['success' => false, 'message' => 'Classwork ID required']);
    exit;
}

try {
    // Get classwork details
    $stmt = $conn->prepare("SELECT * FROM classworks WHERE id = ?");
    $stmt->bind_param("i", $classwork_id);
    $stmt->execute();
    $classwork = $stmt->get_result()->fetch_assoc();
    
    if (!$classwork) {
        echo json_encode(['success' => false, 'message' => 'Classwork not found']);
        exit;
    }
    
    // Get all submissions for this classwork
    $stmt = $conn->prepare("
        SELECT 
            s.*,
            u.full_name,
            u.username,
            u.email
        FROM classwork_submissions s
        JOIN users u ON s.student_id = u.id
        WHERE s.classwork_id = ?
        ORDER BY s.submitted_at DESC
    ");
    
    $stmt->bind_param("i", $classwork_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $submissions = [];
    while ($row = $result->fetch_assoc()) {
        $submissions[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'classwork' => $classwork,
        'submissions' => $submissions
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
