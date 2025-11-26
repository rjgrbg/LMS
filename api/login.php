<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required']);
    exit;
}

$username = trim($data['username']);
$password = $data['password'];

$conn = getDBConnection();

// Check if input is email or username
$stmt = $conn->prepare("SELECT id, username, password, email, full_name, role, is_verified FROM users WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    $stmt->close();
    closeDBConnection($conn);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    $stmt->close();
    closeDBConnection($conn);
    exit;
}

// Update last login
$updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
$updateStmt->bind_param("i", $user['id']);
$updateStmt->execute();
$updateStmt->close();

// Set session variables
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['email'] = $user['email'];
$_SESSION['full_name'] = $user['full_name'];
$_SESSION['role'] = $user['role'];

echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'role' => $user['role'],
    'username' => $user['username']
]);

$stmt->close();
closeDBConnection($conn);
?>
