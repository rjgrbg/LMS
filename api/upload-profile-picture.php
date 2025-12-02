<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if user is authenticated
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Check if file was uploaded
if (!isset($_FILES['profile_picture']) || $_FILES['profile_picture']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
    exit;
}

$file = $_FILES['profile_picture'];
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
$max_size = 5 * 1024 * 1024; // 5MB

// Validate file type
if (!in_array($file['type'], $allowed_types)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, and GIF are allowed']);
    exit;
}

// Validate file size
if ($file['size'] > $max_size) {
    echo json_encode(['success' => false, 'message' => 'File too large. Maximum size is 5MB']);
    exit;
}

// Create profile_pictures directory if it doesn't exist
$upload_dir = '../profile_pictures/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'user_' . $user_id . '_' . time() . '.' . $extension;
$filepath = $upload_dir . $filename;

// Get old profile picture to delete it
$stmt = $conn->prepare("SELECT profile_picture FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Delete old profile picture if exists
if ($user && $user['profile_picture'] && file_exists('../' . $user['profile_picture'])) {
    unlink('../' . $user['profile_picture']);
}

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    // Update database
    $db_path = 'profile_pictures/' . $filename;
    $stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
    $stmt->bind_param("si", $db_path, $user_id);
    
    if ($stmt->execute()) {
        // Update session with new profile picture
        $_SESSION['profile_picture'] = $db_path;
        
        echo json_encode([
            'success' => true,
            'message' => 'Profile picture uploaded successfully',
            'profile_picture' => $db_path
        ]);
    } else {
        // Delete uploaded file if database update fails
        unlink($filepath);
        echo json_encode(['success' => false, 'message' => 'Database update failed: ' . $stmt->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file']);
}

$conn->close();
?>
