<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$student_id = $_SESSION['user_id'];
$classwork_id = $_GET['classwork_id'] ?? null;

if (!$classwork_id) {
    echo json_encode(['success' => false, 'message' => 'Classwork ID required']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT s.*, c.max_score, c.title
        FROM classwork_submissions s
        JOIN classworks c ON s.classwork_id = c.id
        WHERE s.classwork_id = ? AND s.student_id = ?
    ");
    
    $stmt->bind_param("ii", $classwork_id, $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $submission = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'submission' => $submission
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Submission not found']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$conn->close();
?>
