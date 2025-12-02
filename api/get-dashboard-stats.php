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
    $stats = [];
    
    // Total students
    $result = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    $stats['total_students'] = $result->fetch_assoc()['count'];
    
    // Total materials
    $result = $conn->query("SELECT COUNT(*) as count FROM materials");
    $stats['total_materials'] = $result->fetch_assoc()['count'];
    
    // Recent students (last 7 days)
    $result = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    $stats['recent_students'] = $result->fetch_assoc()['count'];
    
    // Count materials by type
    $result = $conn->query("SELECT COUNT(*) as count FROM materials WHERE type = 'Lecture'");
    $stats['lectures'] = $result->fetch_assoc()['count'];
    
    $result = $conn->query("SELECT COUNT(*) as count FROM materials WHERE type = 'PDF'");
    $stats['pdfs'] = $result->fetch_assoc()['count'];
    
    $result = $conn->query("SELECT COUNT(*) as count FROM materials WHERE type = 'Reading'");
    $stats['readings'] = $result->fetch_assoc()['count'];
    
    $result = $conn->query("SELECT COUNT(*) as count FROM materials WHERE type = 'Assignment'");
    $stats['assignments'] = $result->fetch_assoc()['count'];
    
    // Recent materials
    $result = $conn->query("SELECT * FROM materials ORDER BY upload_date DESC LIMIT 10");
    $recent_materials = [];
    while ($row = $result->fetch_assoc()) {
        $recent_materials[] = $row;
    }
    
    // Materials by type
    $result = $conn->query("
        SELECT type, COUNT(*) as count 
        FROM materials 
        GROUP BY type
    ");
    $materials_by_type = [];
    while ($row = $result->fetch_assoc()) {
        $materials_by_type[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'recent_materials' => $recent_materials,
        'materials_by_type' => $materials_by_type
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
