<?php
// Test environment variables
header('Content-Type: application/json');

$env_vars = [
    'DB_HOST' => getenv('DB_HOST'),
    'DB_USER' => getenv('DB_USER'),
    'DB_PASS' => getenv('DB_PASS') ? '***SET***' : 'NOT SET',
    'DB_NAME' => getenv('DB_NAME'),
    'DB_PORT' => getenv('DB_PORT')
];

echo json_encode([
    'environment_variables' => $env_vars,
    'php_version' => phpversion(),
    'mysqli_available' => extension_loaded('mysqli')
], JSON_PRETTY_PRINT);
?>
