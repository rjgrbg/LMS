<?php
session_start();
require_once 'db-config.php';

// Check if ID is provided
if (!isset($_GET['id'])) {
    die('Material ID not provided');
}

$id = intval($_GET['id']);
$user_id = $_SESSION['user_id'] ?? null;

$conn = getDBConnection();

// Get material details
$stmt = $conn->prepare("SELECT file_name, file_path FROM materials WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die('Material not found');
}

$material = $result->fetch_assoc();
$filePath = '../uploads/' . $material['file_path'];

// Check if file exists
if (!file_exists($filePath)) {
    die('File not found');
}

// Track download
try {
    $trackStmt = $conn->prepare("INSERT INTO downloads (material_id, user_id) VALUES (?, ?)");
    $trackStmt->bind_param("ii", $id, $user_id);
    $trackStmt->execute();
    $trackStmt->close();
} catch (Exception $e) {
    // Continue even if tracking fails
    error_log("Download tracking failed: " . $e->getMessage());
}

// Set headers for download
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $material['file_name'] . '"');
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: must-revalidate');
header('Pragma: public');

// Output file
readfile($filePath);

$stmt->close();
closeDBConnection($conn);
exit;
?>