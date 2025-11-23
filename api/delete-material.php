<?php
header('Content-Type: application/json');
require_once 'db-config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'])) {
    echo json_encode(['success' => false, 'message' => 'Material ID not provided']);
    exit;
}

$id = intval($input['id']);

$conn = getDBConnection();

// Get file path before deleting
$stmt = $conn->prepare("SELECT file_path FROM materials WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Material not found']);
    $stmt->close();
    closeDBConnection($conn);
    exit;
}

$material = $result->fetch_assoc();
$filePath = '../uploads/' . $material['file_path'];

// Delete from database
$deleteStmt = $conn->prepare("DELETE FROM materials WHERE id = ?");
$deleteStmt->bind_param("i", $id);

if ($deleteStmt->execute()) {
    // Delete physical file
    if (file_exists($filePath)) {
        unlink($filePath);
    }
    echo json_encode(['success' => true, 'message' => 'Material deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete material: ' . $conn->error]);
}

$stmt->close();
$deleteStmt->close();
closeDBConnection($conn);
?>