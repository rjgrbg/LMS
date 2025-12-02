<?php
// One-time script to update student IDs
// Access via: http://localhost/LMS/api/update-student-ids.php
// DELETE THIS FILE AFTER RUNNING!

require_once 'db-config.php';

echo "<h2>Update Student IDs</h2>";
echo "<p>Updating student IDs for Carlo, Ryan, and Joshua...</p>";

$conn = getDBConnection();

try {
    // Update Carlo's student ID
    $stmt = $conn->prepare("UPDATE users SET student_id = ? WHERE full_name LIKE ?");
    $studentId = '23-2277';
    $name = 'Carlo%';
    $stmt->bind_param("ss", $studentId, $name);
    $stmt->execute();
    $affected = $stmt->affected_rows;
    echo "<p>✓ Updated Carlo: {$affected} row(s) affected</p>";
    $stmt->close();
    
    // Update Ryan's student ID
    $stmt = $conn->prepare("UPDATE users SET student_id = ? WHERE full_name LIKE ?");
    $studentId = '23-5627';
    $name = 'Ryan%';
    $stmt->bind_param("ss", $studentId, $name);
    $stmt->execute();
    $affected = $stmt->affected_rows;
    echo "<p>✓ Updated Ryan: {$affected} row(s) affected</p>";
    $stmt->close();
    
    // Update Joshua's student ID (checking both spellings)
    $stmt = $conn->prepare("UPDATE users SET student_id = ? WHERE full_name LIKE ? OR full_name LIKE ?");
    $studentId = '23-2223';
    $name1 = 'Joshua%';
    $name2 = 'Johsua%';
    $stmt->bind_param("sss", $studentId, $name1, $name2);
    $stmt->execute();
    $affected = $stmt->affected_rows;
    echo "<p>✓ Updated Joshua: {$affected} row(s) affected</p>";
    $stmt->close();
    
    // Display updated records
    echo "<h3>Updated Records:</h3>";
    echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
    echo "<tr><th>ID</th><th>Full Name</th><th>Student ID</th><th>Username</th><th>Email</th></tr>";
    
    $result = $conn->query("SELECT id, full_name, student_id, username, email FROM users WHERE student_id IN ('23-2277', '23-5627', '23-2223') ORDER BY full_name");
    
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>{$row['id']}</td>";
        echo "<td>{$row['full_name']}</td>";
        echo "<td><strong>{$row['student_id']}</strong></td>";
        echo "<td>{$row['username']}</td>";
        echo "<td>{$row['email']}</td>";
        echo "</tr>";
    }
    
    echo "</table>";
    
    echo "<h3 style='color: green;'>✓ Student IDs updated successfully!</h3>";
    echo "<p style='color: red;'><strong>IMPORTANT:</strong> Delete this file (api/update-student-ids.php) for security!</p>";
    
} catch (Exception $e) {
    echo "<h3 style='color: red;'>✗ Error:</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
}

closeDBConnection($conn);
?>
