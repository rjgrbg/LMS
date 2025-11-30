<?php
session_start();
require_once 'db-config.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    die('Unauthorized');
}

$submission_id = $_GET['id'] ?? null;

if (!$submission_id) {
    die('Submission ID required');
}

try {
    $stmt = $conn->prepare("SELECT file_path, file_name FROM classwork_submissions WHERE id = ?");
    $stmt->bind_param("i", $submission_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        die('Submission not found');
    }
    
    $submission = $result->fetch_assoc();
    $file_path = $submission['file_path'];
    $file_name = $submission['file_name'];
    
    if (!file_exists($file_path)) {
        die('File not found');
    }
    
    // Set headers for download
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $file_name . '"');
    header('Content-Length: ' . filesize($file_path));
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    
    // Output file
    readfile($file_path);
    exit;
    
} catch (Exception $e) {
    die('Error: ' . $e->getMessage());
}

$conn->close();
?>
