<?php
require_once 'db-config.php';

$conn = getDBConnection();

// Get all materials
$sql = "SELECT file_name, file_path FROM materials";
$result = $conn->query($sql);

if ($result->num_rows === 0) {
    die('No materials available');
}

// Create a temporary zip file
$zipFileName = 'scosci1_materials_' . date('Y-m-d') . '.zip';
$zipPath = '../uploads/' . $zipFileName;

$zip = new ZipArchive();

if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
    die('Could not create zip file');
}

// Add files to zip
while ($row = $result->fetch_assoc()) {
    $filePath = '../uploads/' . $row['file_path'];
    if (file_exists($filePath)) {
        $zip->addFile($filePath, $row['file_name']);
    }
}

$zip->close();

// Download the zip file
header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . $zipFileName . '"');
header('Content-Length: ' . filesize($zipPath));
header('Cache-Control: must-revalidate');
header('Pragma: public');

readfile($zipPath);

// Delete the temporary zip file
unlink($zipPath);

closeDBConnection($conn);
exit;
?>