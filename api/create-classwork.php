<?php
// Disable error display to prevent HTML in JSON response
ini_set('display_errors', 0);
error_reporting(0);

session_start();
header('Content-Type: application/json');

try {
    require_once 'db-config.php';
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Please login as admin']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$due_date = $data['due_date'] ?? '';
$max_score = isset($data['max_score']) ? intval($data['max_score']) : 100;
$admin_id = $_SESSION['user_id'];

// Validation
if (empty($title) || empty($description) || empty($due_date)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if ($max_score < 1 || $max_score > 1000) {
    echo json_encode(['success' => false, 'message' => 'Max score must be between 1 and 1000']);
    exit;
}

try {
    // Check if table exists
    $check = $conn->query("SHOW TABLES LIKE 'classworks'");
    if ($check->num_rows === 0) {
        echo json_encode([
            'success' => false, 
            'message' => 'Database tables not found. Please run the SQL file to create classwork tables.'
        ]);
        exit;
    }
    
    $stmt = $conn->prepare("
        INSERT INTO classworks (title, description, due_date, max_score, created_by)
        VALUES (?, ?, ?, ?, ?)
    ");
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $stmt->bind_param("sssii", $title, $description, $due_date, $max_score, $admin_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Classwork created successfully!',
            'classwork_id' => $conn->insert_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create classwork: ' . $stmt->error]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
