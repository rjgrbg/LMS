<?php
session_start();
header('Content-Type: application/json');
require_once 'db-config.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$days = $_GET['days'] ?? 'all'; // Default to all time

try {
    $stats = [];
    
    // Calculate date range
    if ($days === 'all') {
        $dateCondition = "1=1";
    } else if ($days == 1) {
        // Today only
        $dateCondition = "DATE(created_at) = CURDATE()";
    } else {
        $dateCondition = "DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL $days DAY)";
    }
    
    // Active students (students who logged in within the period)
    $query = "SELECT COUNT(DISTINCT id) as count FROM users 
              WHERE role = 'student' AND last_login IS NOT NULL";
    if ($days === 'all') {
        // All time - no date filter
    } else if ($days == 1) {
        $query .= " AND DATE(last_login) = CURDATE()";
    } else {
        $query .= " AND DATE(last_login) >= DATE_SUB(CURDATE(), INTERVAL $days DAY)";
    }
    $result = $conn->query($query);
    $stats['active_students'] = $result->fetch_assoc()['count'];
    
    // New registrations over time
    $query = "SELECT DATE(created_at) as date, COUNT(*) as count 
              FROM users 
              WHERE role = 'student' AND $dateCondition
              GROUP BY DATE(created_at)
              ORDER BY date ASC";
    $result = $conn->query($query);
    $registrations = [];
    while ($row = $result->fetch_assoc()) {
        $registrations[] = $row;
    }
    $stats['registrations'] = $registrations;
    $stats['total_new_registrations'] = array_sum(array_column($registrations, 'count'));
    
    // Material downloads by material (for pie chart)
    $downloadDateCondition = "1=1";
    if ($days === 'all') {
        // All time
    } else if ($days == 1) {
        $downloadDateCondition = "DATE(d.download_date) = CURDATE()";
    } else {
        $downloadDateCondition = "DATE(d.download_date) >= DATE_SUB(CURDATE(), INTERVAL $days DAY)";
    }
    
    $query = "SELECT m.title, COUNT(d.id) as download_count 
              FROM downloads d
              JOIN materials m ON d.material_id = m.id
              WHERE $downloadDateCondition
              GROUP BY m.id, m.title
              ORDER BY download_count DESC
              LIMIT 10";
    $result = $conn->query($query);
    $downloadsByMaterial = [];
    $totalDownloads = 0;
    while ($row = $result->fetch_assoc()) {
        $downloadsByMaterial[] = $row;
        $totalDownloads += $row['download_count'];
    }
    $stats['downloads_by_material'] = $downloadsByMaterial;
    $stats['total_downloads'] = $totalDownloads;
    
    // Active students over time (students who logged in each day)
    $query = "SELECT DATE(last_login) as date, COUNT(DISTINCT id) as count 
              FROM users 
              WHERE role = 'student' AND last_login IS NOT NULL";
    if ($days === 'all') {
        // All time
    } else if ($days == 1) {
        $query .= " AND DATE(last_login) = CURDATE()";
    } else {
        $query .= " AND DATE(last_login) >= DATE_SUB(CURDATE(), INTERVAL $days DAY)";
    }
    $query .= " GROUP BY DATE(last_login) ORDER BY date ASC";
    $result = $conn->query($query);
    $activeStudentsTimeline = [];
    while ($row = $result->fetch_assoc()) {
        $activeStudentsTimeline[] = $row;
    }
    $stats['active_students_timeline'] = $activeStudentsTimeline;
    
    // Material types distribution
    $query = "SELECT type, COUNT(*) as count FROM materials GROUP BY type";
    $result = $conn->query($query);
    $materialTypes = [];
    $totalMaterials = 0;
    while ($row = $result->fetch_assoc()) {
        $materialTypes[] = $row;
        $totalMaterials += $row['count'];
    }
    $stats['material_types'] = $materialTypes;
    $stats['total_materials'] = $totalMaterials;
    
    echo json_encode([
        'success' => true,
        'stats' => $stats
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
