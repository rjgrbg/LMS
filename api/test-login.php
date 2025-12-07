<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['test' => 'Login Test'];

try {
    require_once 'db-config.php';
    $conn = getDBConnection();
    
    $response['db_connected'] = true;
    
    // Check if users table exists and has data
    $result = $conn->query("SELECT username, email, role FROM users LIMIT 5");
    if ($result) {
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = [
                'username' => $row['username'],
                'email' => $row['email'],
                'role' => $row['role']
            ];
        }
        $response['users_found'] = count($users);
        $response['sample_users'] = $users;
    } else {
        $response['error'] = 'Could not query users table: ' . $conn->error;
    }
    
    closeDBConnection($conn);
} catch (Exception $e) {
    $response['db_connected'] = false;
    $response['error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
