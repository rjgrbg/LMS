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
    
    // Total classworks
    $result = $conn->query("SELECT COUNT(*) as count FROM classworks WHERE status = 'active'");
    $stats['total_classworks'] = $result->fetch_assoc()['count'];
    
    // Total submissions
    $result = $conn->query("SELECT COUNT(*) as count FROM classwork_submissions");
    $stats['total_submissions'] = $result->fetch_assoc()['count'];
    
    // Pending grading
    $result = $conn->query("SELECT COUNT(*) as count FROM classwork_submissions WHERE status != 'graded'");
    $stats['pending_grading'] = $result->fetch_assoc()['count'];
    
    // Recent students (last 7 days)
    $result = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    $stats['recent_students'] = $result->fetch_assoc()['count'];
    
    // Recent materials (last 7 days)
    $result = $conn->query("SELECT * FROM materials ORDER BY upload_date DESC LIMIT 5");
    $recent_materials = [];
    while ($row = $result->fetch_assoc()) {
        $recent_materials[] = $row;
    }
    
    // Recent submissions (last 10)
    $result = $conn->query("
        SELECT s.*, u.full_name, u.email, c.title as classwork_title
        FROM classwork_submissions s
        JOIN users u ON s.student_id = u.id
        JOIN classworks c ON s.classwork_id = c.id
        ORDER BY s.submitted_at DESC
        LIMIT 10
    ");
    $recent_submissions = [];
    while ($row = $result->fetch_assoc()) {
        $recent_submissions[] = $row;
    }
    
    // Upcoming deadlines
    $result = $conn->query("
        SELECT * FROM classworks 
        WHERE status = 'active' AND due_date > NOW()
        ORDER BY due_date ASC
        LIMIT 5
    ");
    $upcoming_deadlines = [];
    while ($row = $result->fetch_assoc()) {
        $upcoming_deadlines[] = $row;
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
        'recent_submissions' => $recent_submissions,
        'upcoming_deadlines' => $upcoming_deadlines,
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
