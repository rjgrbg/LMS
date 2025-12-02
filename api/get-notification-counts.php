<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if user is authenticated
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

$counts = [
    'total_students' => 0,
    'total_materials' => 0
];

if ($role === 'admin') {
    // Count total students
    $stmt = $conn->prepare("
        SELECT COUNT(*) as count 
        FROM users 
        WHERE role = 'student'
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $counts['total_students'] = $row['count'];
    
    // Count total materials
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM materials");
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $counts['total_materials'] = $row['count'];
}

echo json_encode([
    'success' => true,
    'counts' => $counts
]);

$conn->close();
?>
