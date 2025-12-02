<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'authenticated' => true,
        'user_id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'email' => $_SESSION['email'],
        'full_name' => $_SESSION['full_name'],
        'role' => $_SESSION['role'],
        'student_id' => $_SESSION['student_id'] ?? null,
        'profile_picture' => $_SESSION['profile_picture'] ?? null
    ]);
} else {
    echo json_encode(['authenticated' => false]);
}
?>
