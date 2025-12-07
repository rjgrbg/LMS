<?php
// Create admin user script
// Access this once to create an admin account, then delete this file!

header('Content-Type: application/json');
require_once 'db-config.php';

$conn = getDBConnection();

// Check if admin already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE username = 'admin'");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Admin user already exists!'
    ]);
    exit;
}

// Create admin user
// Username: admin
// Password: password (CHANGE THIS AFTER FIRST LOGIN!)
$username = 'admin';
$password = password_hash('password', PASSWORD_DEFAULT);
$email = 'admin@scosci1.com';
$fullName = 'System Administrator';
$role = 'admin';

$stmt = $conn->prepare("INSERT INTO users (username, password, email, full_name, role, is_verified) VALUES (?, ?, ?, ?, ?, 1)");
$stmt->bind_param("sssss", $username, $password, $email, $fullName, $role);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Admin user created successfully!',
        'credentials' => [
            'username' => 'admin',
            'password' => 'password',
            'note' => 'PLEASE CHANGE PASSWORD AFTER FIRST LOGIN!'
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to create admin user',
        'error' => $stmt->error
    ]);
}

$stmt->close();
closeDBConnection($conn);
?>
