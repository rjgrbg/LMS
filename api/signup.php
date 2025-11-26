<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once 'db-config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Invalid request data']);
    exit;
}

if (!isset($data['fullName']) || !isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$fullName = trim($data['fullName']);
$username = trim($data['username']);
$email = trim($data['email']);
$password = $data['password'];

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

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert user with is_verified = 1 (no email verification needed)
$stmt = $conn->prepare("INSERT INTO users (username, password, email, full_name, is_verified) VALUES (?, ?, ?, ?, 1)");
$stmt->bind_param("ssss", $username, $hashedPassword, $email, $fullName);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully! You can now login.'
    ]);
} else {
    error_log("Database error: " . $stmt->error);
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
closeDBConnection($conn);
?>
