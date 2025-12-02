<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once 'db-config.php';

// Get form data
$fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
$studentId = isset($_POST['studentId']) ? trim($_POST['studentId']) : '';
$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($fullName) || empty($studentId) || empty($username) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Validate password length
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
    exit;
}

$conn = getDBConnection();

// Check if username already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists']);
    $stmt->close();
    closeDBConnection($conn);
    exit;
}
$stmt->close();

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    $stmt->close();
    closeDBConnection($conn);
    exit;
}
$stmt->close();

// Handle profile picture upload
$profilePicturePath = null;
if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['profilePicture'];
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    $max_size = 5 * 1024 * 1024; // 5MB
    
    if (in_array($file['type'], $allowed_types) && $file['size'] <= $max_size) {
        $upload_dir = '../profile_pictures/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'user_' . uniqid() . '_' . time() . '.' . $extension;
        $filepath = $upload_dir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            $profilePicturePath = 'profile_pictures/' . $filename;
        }
    }
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if student ID already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE student_id = ?");
$stmt->bind_param("s", $studentId);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Student ID already registered']);
    $stmt->close();
    closeDBConnection($conn);
    exit;
}
$stmt->close();

// Insert user
$stmt = $conn->prepare("INSERT INTO users (username, password, email, full_name, student_id, profile_picture, is_verified) VALUES (?, ?, ?, ?, ?, ?, 1)");
$stmt->bind_param("ssssss", $username, $hashedPassword, $email, $fullName, $studentId, $profilePicturePath);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully! You can now login.',
        'profile_picture' => $profilePicturePath
    ]);
} else {
    error_log("Database error: " . $stmt->error);
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
closeDBConnection($conn);
?>
