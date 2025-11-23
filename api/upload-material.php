<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Increase upload limits
ini_set('upload_max_filesize', '100M');
ini_set('post_max_size', '100M');
ini_set('max_execution_time', '300');
ini_set('max_input_time', '300');

header('Content-Type: application/json');

// Log all received data for debugging
error_log("POST data: " . print_r($_POST, true));
error_log("FILES data: " . print_r($_FILES, true));

require_once 'db-config.php';

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get form data
$title = isset($_POST['title']) ? trim($_POST['title']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$type = isset($_POST['type']) ? trim($_POST['type']) : '';

// Debug log
error_log("Title: $title, Description: $description, Type: $type");

// Validate inputs
if (empty($title)) {
    echo json_encode(['success' => false, 'message' => 'Material title is required']);
    exit;
}

if (empty($description)) {
    echo json_encode(['success' => false, 'message' => 'Description is required']);
    exit;
}

if (empty($type)) {
    echo json_encode(['success' => false, 'message' => 'Material type is required']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['file'])) {
    echo json_encode(['success' => false, 'message' => 'No file was selected. Please choose a file to upload.']);
    exit;
}

if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errorMessage = 'File upload error: ';
    switch ($_FILES['file']['error']) {
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            $errorMessage .= 'File size exceeds limit (100MB max)';
            break;
        case UPLOAD_ERR_PARTIAL:
            $errorMessage .= 'File was only partially uploaded';
            break;
        case UPLOAD_ERR_NO_FILE:
            $errorMessage .= 'No file was uploaded';
            break;
        case UPLOAD_ERR_NO_TMP_DIR:
            $errorMessage .= 'Missing temporary folder';
            break;
        case UPLOAD_ERR_CANT_WRITE:
            $errorMessage .= 'Failed to write file to disk';
            break;
        default:
            $errorMessage .= 'Unknown error (code: ' . $_FILES['file']['error'] . ')';
    }
    echo json_encode(['success' => false, 'message' => $errorMessage]);
    exit;
}

$file = $_FILES['file'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileSize = $file['size'];

// Get file extension
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

// Allowed extensions
$allowedExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx'];

// Validate file extension
if (!in_array($fileExt, $allowedExtensions)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only PDF, PPT, PPTX, DOC, and DOCX files are allowed. You uploaded: ' . $fileExt]);
    exit;
}

// Validate file size (100MB max)
$maxSize = 100 * 1024 * 1024; // 100MB in bytes
if ($fileSize > $maxSize) {
    $sizeMB = round($fileSize / 1048576, 2);
    echo json_encode(['success' => false, 'message' => 'File size (' . $sizeMB . 'MB) exceeds 100MB limit']);
    exit;
}

// Create uploads directory if it doesn't exist
$uploadDir = '../uploads/';
if (!file_exists($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create uploads directory. Check folder permissions.']);
        exit;
    }
}

// Check if uploads directory is writable
if (!is_writable($uploadDir)) {
    echo json_encode(['success' => false, 'message' => 'Uploads directory is not writable. Please check folder permissions.']);
    exit;
}

// Generate unique file name
$newFileName = uniqid('material_', true) . '.' . $fileExt;
$uploadPath = $uploadDir . $newFileName;

// Move uploaded file
if (!move_uploaded_file($fileTmpName, $uploadPath)) {
    echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file. Check server permissions.']);
    exit;
}

// Verify file was actually uploaded
if (!file_exists($uploadPath)) {
    echo json_encode(['success' => false, 'message' => 'File upload verification failed']);
    exit;
}

// Insert into database
try {
    $conn = getDBConnection();
    
    $stmt = $conn->prepare("INSERT INTO materials (title, description, type, file_name, file_path, upload_date) VALUES (?, ?, ?, ?, ?, NOW())");
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("sssss", $title, $description, $type, $fileName, $newFileName);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Material uploaded successfully!',
            'material_id' => $conn->insert_id
        ]);
    } else {
        // Delete uploaded file if database insert fails
        if (file_exists($uploadPath)) {
            unlink($uploadPath);
        }
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $stmt->close();
    closeDBConnection($conn);
    
} catch (Exception $e) {
    // Delete uploaded file on error
    if (file_exists($uploadPath)) {
        unlink($uploadPath);
    }
    
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>