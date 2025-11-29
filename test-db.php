<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Database Connection Test</h2>";

// Test 1: Basic connection
echo "<h3>Test 1: Basic Connection</h3>";
$conn = new mysqli('127.0.0.1', 'root', '', 'scosci1_lms', 3306);

if ($conn->connect_error) {
    echo "❌ Connection failed: " . $conn->connect_error . "<br>";
} else {
    echo "✅ Connection successful!<br>";
    echo "Server info: " . $conn->server_info . "<br>";
    echo "Host info: " . $conn->host_info . "<br>";
    
    // Test 2: Query materials table
    echo "<h3>Test 2: Query Materials Table</h3>";
    $result = $conn->query("SELECT COUNT(*) as count FROM materials");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✅ Materials table exists. Row count: " . $row['count'] . "<br>";
    } else {
        echo "❌ Query failed: " . $conn->error . "<br>";
    }
    
    // Test 3: Check table structure
    echo "<h3>Test 3: Table Structure</h3>";
    $result = $conn->query("DESCRIBE materials");
    if ($result) {
        echo "✅ Table structure:<br>";
        echo "<table border='1' cellpadding='5'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row['Field'] . "</td>";
            echo "<td>" . $row['Type'] . "</td>";
            echo "<td>" . $row['Null'] . "</td>";
            echo "<td>" . $row['Key'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    $conn->close();
}
?>
