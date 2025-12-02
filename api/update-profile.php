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

$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents('php://input'), true);

$full_name = trim($data['full_name'] ?? '');
$email = trim($data['email'] ?? '');
$current_password = $data['current_password'] ?? '';
$new_password = $data['new_password'] ?? '';

// Validate required fields
if (empty($full_name) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Full name and email are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

try {
    // If changing password, verify current password
    if (!empty($new_password)) {
        if (empty($current_password)) {
            echo json_encode(['success' => false, 'message' => 'Current password is required']);
            exit;
        }
        
        // Get current password hash
        $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        if (!$user || !password_verify($current_password, $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            exit;
        }
        
        // Validate new password
        if (strlen($new_password) < 6) {
            echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters']);
            exit;
        }
        
        // Update with new password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET full_name = ?, email = ?, password = ? WHERE id = ?");
        $stmt->bind_param("sssi", $full_name, $email, $hashed_password, $user_id);
    } else {
        // Update without changing password
        $stmt = $conn->prepare("UPDATE users SET full_name = ?, email = ? WHERE id = ?");
        $stmt->bind_param("ssi", $full_name, $email, $user_id);
    }
    
    if ($stmt->execute()) {
        // Update session
        $_SESSION['full_name'] = $full_name;
        
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update profile'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
