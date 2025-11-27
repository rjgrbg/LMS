<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$conn = getDBConnection();

// Get all students (exclude admins)
$stmt = $conn->prepare("SELECT id, username, email, full_name, created_at, last_login FROM users WHERE role = 'student' ORDER BY created_at DESC");
$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

// Get statistics
$statsStmt = $conn->prepare("SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN last_login IS NOT NULL THEN 1 ELSE 0 END) as active,
    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as recent
    FROM users WHERE role = 'student'");
$statsStmt->execute();
$stats = $statsStmt->get_result()->fetch_assoc();

echo json_encode([
    'success' => true,
    'users' => $users,
    'stats' => $stats
]);

$statsStmt->close();
$stmt->close();
closeDBConnection($conn);
?>
