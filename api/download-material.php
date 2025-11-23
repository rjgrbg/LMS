<?php
require_once 'db-config.php';

// Check if ID is provided
if (!isset($_GET['id'])) {
    die('Material ID not provided');
}

$id = intval($_GET['id']);

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