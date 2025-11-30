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
$classwork_id = $data['id'] ?? null;

if (!$classwork_id) {
    echo json_encode(['success' => false, 'message' => 'Classwork ID required']);
    exit;
}

try {
    // Get all submissions for this classwork to delete files
    $stmt = $conn->prepare("SELECT file_path FROM classwork_submissions WHERE classwork_id = ?");
    $stmt->bind_param("i", $classwork_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Delete all submission files
    while ($row = $result->fetch_assoc()) {
        if (file_exists($row['file_path'])) {
            unlink($row['file_path']);
        }
    }
    
    // Delete classwork (submissions will be deleted by CASCADE)
    $stmt = $conn->prepare("DELETE FROM classworks WHERE id = ?");
    $stmt->bind_param("i", $classwork_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Classwork deleted successfully!'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete classwork']);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
