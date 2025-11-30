<?php
session_start();
header('Content-Type: application/json');

$errors = [];
$success = [];

// Check 1: Session
if (!isset($_SESSION['user_id'])) {
    $errors[] = "Not logged in";
} else {
    $success[] = "Logged in as user ID: " . $_SESSION['user_id'];
}

if (!isset($_SESSION['role'])) {
    $errors[] = "No role set";
} else {
    $success[] = "Role: " . $_SESSION['role'];
}

// Check 2: Database connection
try {
    require_once 'db-config.php';
    $success[] = "Database connection successful";
    
    // Check 3: Tables exist
    $result = $conn->query("SHOW TABLES LIKE 'classworks'");
    if ($result && $result->num_rows > 0) {
        $success[] = "classworks table exists";
    } else {
        $errors[] = "classworks table does NOT exist - Run the SQL file!";
    }
    
    $result = $conn->query("SHOW TABLES LIKE 'classwork_submissions'");
    if ($result && $result->num_rows > 0) {
        $success[] = "classwork_submissions table exists";
    } else {
        $errors[] = "classwork_submissions table does NOT exist - Run the SQL file!";
    }
    
    $conn->close();
} catch (Exception $e) {
    $errors[] = "Database error: " . $e->getMessage();
}

// Check 4: Submissions folder
if (file_exists('../submissions')) {
    $success[] = "submissions folder exists";
    if (is_writable('../submissions')) {
        $success[] = "submissions folder is writable";
    } else {
        $errors[] = "submissions folder is NOT writable";
    }
} else {
    $errors[] = "submissions folder does NOT exist - Create it!";
}

echo json_encode([
    'success' => count($errors) === 0,
    'errors' => $errors,
    'checks_passed' => $success,
    'message' => count($errors) === 0 ? 'All checks passed!' : 'Some checks failed'
], JSON_PRETTY_PRINT);
?>
