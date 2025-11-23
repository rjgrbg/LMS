<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db-config.php';

// Log for debugging
error_log("Update material request received");
error_log("POST data: " . file_get_contents('php://input'));

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'])) {
    echo json_encode(['success' => false, 'message' => 'Material ID not provided']);
    exit;
}

$id = intval($input['id']);
$title = isset($input['title']) ? trim($input['title']) : '';
$description = isset($input['description']) ? trim($input['description']) : '';
$type = isset($input['type']) ? trim($input['type']) : '';

// Validate inputs
if (empty($title)) {
    echo json_encode(['success' => false, 'message' => 'Title is required']);
    exit;
}

if (empty($description)) {
    echo json_encode(['success' => false, 'message' => 'Description is required']);
    exit;
}

if (empty($type)) {
    echo json_encode(['success' => false, 'message' => 'Type is required']);
    exit;
}

try {
    $conn = getDBConnection();

    // Check if material exists
    $checkStmt = $conn->prepare("SELECT id FROM materials WHERE id = ?");
    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Material not found']);
        $checkStmt->close();
        closeDBConnection($conn);
        exit;
    }
    $checkStmt->close();

    // Update material
    $stmt = $conn->prepare("UPDATE materials SET title = ?, description = ?, type = ? WHERE id = ?");
    $stmt->bind_param("sssi", $title, $description, $type, $id);

    if ($stmt->execute()) {
        error_log("Material updated successfully: ID $id");
        echo json_encode(['success' => true, 'message' => 'Material updated successfully']);
    } else {
        error_log("Failed to update material: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Failed to update material: ' . $conn->error]);
    }

    $stmt->close();
    closeDBConnection($conn);
    
} catch (Exception $e) {
    error_log("Exception in update-material.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>