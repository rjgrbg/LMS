<?php
header('Content-Type: application/json');
require_once 'db-config.php';

$conn = getDBConnection();

// Get all materials ordered by upload date (newest first)
$sql = "SELECT id, title, description, type, file_name, file_path, upload_date FROM materials ORDER BY upload_date DESC";
$result = $conn->query($sql);

$materials = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $materials[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'materials' => $materials
]);

closeDBConnection($conn);
?>