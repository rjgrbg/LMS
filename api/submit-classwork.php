<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if user is authenticated
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$student_id = $_SESSION['user_id'];
$classwork_id = $_POST['classwork_id'] ?? null;

if (!$classwork_id) {
    echo json_encode(['success' => false, 'message' => 'Classwork ID is required']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
    exit;
}

$file = $_FILES['file'];
$file_name = $file['name'];
$file_tmp = $file['tmp_name'];
$file_size = $file['size'];

// Validate file size (50MB max)
$max_size = 50 * 1024 * 1024;
if ($file_size > $max_size) {
    echo json_encode(['success' => false, 'message' => 'File size exceeds 50MB limit']);
    exit;
}

// Validate file extension
$allowed_extensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip'];
$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

if (!in_array($file_ext, $allowed_extensions)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type']);
    exit;
}

try {
    // Check if classwork exists and is active
    $stmt = $conn->prepare("SELECT id, due_date FROM classworks WHERE id = ? AND status = 'active'");
    $stmt->bind_param("i", $classwork_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Classwork not found or closed']);
        exit;
    }
    
    $classwork = $result->fetch_assoc();
    
    // Check if already submitted
    $stmt = $conn->prepare("SELECT id FROM classwork_submissions WHERE classwork_id = ? AND student_id = ?");
    $stmt->bind_param("ii", $classwork_id, $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'You have already submitted this classwork']);
        exit;
    }
    
    // Create submissions directory if it doesn't exist
    $upload_dir = '../submissions/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    // Generate unique filename
    $unique_name = 'submission_' . $classwork_id . '_' . $student_id . '_' . uniqid() . '.' . $file_ext;
    $file_path = $upload_dir . $unique_name;
    
    // Move uploaded file
    if (!move_uploaded_file($file_tmp, $file_path)) {
        echo json_encode(['success' => false, 'message' => 'Failed to save file']);
        exit;
    }
    
    // Determine if submission is late
    $due_date = new DateTime($classwork['due_date']);
    $now = new DateTime();
    $status = ($now > $due_date) ? 'late' : 'submitted';
    
    // Insert submission record
    $stmt = $conn->prepare("
        INSERT INTO classwork_submissions (classwork_id, student_id, file_path, file_name, status)
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->bind_param("iisss", $classwork_id, $student_id, $file_path, $file_name, $status);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => $status === 'late' ? 'Work submitted (Late)' : 'Work submitted successfully!'
        ]);
    } else {
        // Delete uploaded file if database insert fails
        unlink($file_path);
        echo json_encode(['success' => false, 'message' => 'Failed to save submission']);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
