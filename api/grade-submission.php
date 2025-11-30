<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$submission_id = $data['submission_id'] ?? null;
$score = $data['score'] ?? null;
$feedback = $data['feedback'] ?? '';

if (!$submission_id || $score === null) {
    echo json_encode(['success' => false, 'message' => 'Submission ID and score are required']);
    exit;
}

try {
    // Get submission and classwork details
    $stmt = $conn->prepare("
        SELECT s.*, c.max_score 
        FROM classwork_submissions s
        JOIN classworks c ON s.classwork_id = c.id
        WHERE s.id = ?
    ");
    $stmt->bind_param("i", $submission_id);
    $stmt->execute();
    $submission = $stmt->get_result()->fetch_assoc();
    
    if (!$submission) {
        echo json_encode(['success' => false, 'message' => 'Submission not found']);
        exit;
    }
    
    // Validate score
    if ($score < 0 || $score > $submission['max_score']) {
        echo json_encode(['success' => false, 'message' => 'Score must be between 0 and ' . $submission['max_score']]);
        exit;
    }
    
    // Update submission with grade
    $stmt = $conn->prepare("
        UPDATE classwork_submissions 
        SET score = ?, feedback = ?, status = 'graded'
        WHERE id = ?
    ");
    
    $stmt->bind_param("isi", $score, $feedback, $submission_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Submission graded successfully!'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to grade submission']);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
