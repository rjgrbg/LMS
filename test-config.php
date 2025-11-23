<?php
// Test PHP Configuration for File Uploads
echo "<h2>PHP Upload Configuration Test</h2>";
echo "<style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; max-width: 600px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    .good { color: green; font-weight: bold; }
    .bad { color: red; font-weight: bold; }
</style>";

echo "<table>";
echo "<tr><th>Setting</th><th>Current Value</th><th>Status</th></tr>";

// Check upload_max_filesize
$upload_max = ini_get('upload_max_filesize');
echo "<tr><td>upload_max_filesize</td><td>$upload_max</td>";
echo "<td class='" . (substr($upload_max, 0, -1) >= 100 ? 'good' : 'bad') . "'>";
echo substr($upload_max, 0, -1) >= 100 ? "✓ Good" : "✗ Too Small (Need 100M)";
echo "</td></tr>";

// Check post_max_size
$post_max = ini_get('post_max_size');
echo "<tr><td>post_max_size</td><td>$post_max</td>";
echo "<td class='" . (substr($post_max, 0, -1) >= 100 ? 'good' : 'bad') . "'>";
echo substr($post_max, 0, -1) >= 100 ? "✓ Good" : "✗ Too Small (Need 100M)";
echo "</td></tr>";

// Check memory_limit
$memory = ini_get('memory_limit');
echo "<tr><td>memory_limit</td><td>$memory</td>";
echo "<td class='" . (substr($memory, 0, -1) >= 256 ? 'good' : 'bad') . "'>";
echo substr($memory, 0, -1) >= 256 ? "✓ Good" : "✗ Too Small (Need 256M)";
echo "</td></tr>";

// Check max_execution_time
$max_exec = ini_get('max_execution_time');
echo "<tr><td>max_execution_time</td><td>{$max_exec}s</td>";
echo "<td class='" . ($max_exec >= 300 ? 'good' : 'bad') . "'>";
echo $max_exec >= 300 ? "✓ Good" : "✗ Too Small (Need 300s)";
echo "</td></tr>";

// Check max_input_time
$max_input = ini_get('max_input_time');
echo "<tr><td>max_input_time</td><td>{$max_input}s</td>";
echo "<td class='" . ($max_input >= 300 ? 'good' : 'bad') . "'>";
echo $max_input >= 300 ? "✓ Good" : "✗ Too Small (Need 300s)";
echo "</td></tr>";

// Check file_uploads
$file_uploads = ini_get('file_uploads');
echo "<tr><td>file_uploads</td><td>" . ($file_uploads ? 'On' : 'Off') . "</td>";
echo "<td class='" . ($file_uploads ? 'good' : 'bad') . "'>";
echo $file_uploads ? "✓ Enabled" : "✗ Disabled";
echo "</td></tr>";

// Check upload_tmp_dir
$tmp_dir = ini_get('upload_tmp_dir');
$tmp_dir = empty($tmp_dir) ? sys_get_temp_dir() : $tmp_dir;
echo "<tr><td>upload_tmp_dir</td><td>$tmp_dir</td>";
echo "<td class='" . (is_writable($tmp_dir) ? 'good' : 'bad') . "'>";
echo is_writable($tmp_dir) ? "✓ Writable" : "✗ Not Writable";
echo "</td></tr>";

echo "</table>";

echo "<h3>Next Steps:</h3>";
echo "<ul>";
if (substr($upload_max, 0, -1) < 100) {
    echo "<li>❌ Increase upload_max_filesize to 100M in php.ini</li>";
} else {
    echo "<li>✓ upload_max_filesize is correct</li>";
}
if (substr($post_max, 0, -1) < 100) {
    echo "<li>❌ Increase post_max_size to 100M in php.ini</li>";
} else {
    echo "<li>✓ post_max_size is correct</li>";
}
echo "<li>After making changes, restart Apache in XAMPP</li>";
echo "<li>Then refresh this page to verify changes</li>";
echo "</ul>";

echo "<h3>Instructions:</h3>";
echo "<ol>";
echo "<li>Open XAMPP Control Panel</li>";
echo "<li>Click 'Config' next to Apache → Select 'PHP (php.ini)'</li>";
echo "<li>Search for each setting (Ctrl+F) and update the values</li>";
echo "<li>Save the file (Ctrl+S)</li>";
echo "<li>Stop and Start Apache in XAMPP</li>";
echo "<li>Refresh this page</li>";
echo "</ol>";

echo "<br><p><strong>Current PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Server Software:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
?>