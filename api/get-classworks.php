<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if user is authenticated
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$student_id = $_SESSION['user_id'];

try {
    // Get all classworks with submission status
    $stmt = $conn->prepare("
        SELECT 
            c.*,
            s.id as submission_id,
            s.score,
            s.status as submission_status,
            s.submitted_at,
            CASE 
                WHEN s.id IS NULL THEN 'pending'
                WHEN s.status = 'graded' THEN 'graded'
                ELSE 'submitted'
            END as submission_status
        FROM classworks c
        LEFT JOIN classwork_submissions s ON c.id = s.classwork_id AND s.student_id = ?
        WHERE c.status = 'active'
        ORDER BY c.due_date ASC
    ");
    
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $classworks = [];
    while ($row = $result->fetch_assoc()) {
        $classworks[] = $row;
    }
    
    // Calculate statistics
    $total = count($classworks);
    $submitted = 0;
    $graded = 0;
    $total_score = 0;
    
    foreach ($classworks as $cw) {
        if ($cw['submission_status'] === 'submitted' || $cw['submission_status'] === 'graded') {
            $submitted++;
        }
        if ($cw['submission_status'] === 'graded' && $cw['score'] !== null) {
            $graded++;
            $total_score += $cw['score'];
        }
    }
    
    $average_score = $graded > 0 ? round($total_score / $graded, 1) : null;
    
    $stats = [
        'total' => $total,
        'submitted' => $submitted,
        'graded' => $graded,
        'average_score' => $average_score
    ];
    
    echo json_encode([
        'success' => true,
        'classworks' => $classworks,
        'stats' => $stats
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error loading classworks: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
