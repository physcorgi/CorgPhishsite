<?php
// Простой файл для проверки работоспособности PHP на сервере
header('Content-Type: application/json');

$serverInfo = [
    'status' => 'ok',
    'php_version' => phpversion(),
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
    'timestamp' => date('Y-m-d H:i:s'),
    'features' => [
        'gd' => extension_loaded('gd'),
        'curl' => extension_loaded('curl'),
        'mysqli' => extension_loaded('mysqli'),
        'pdo_mysql' => extension_loaded('pdo_mysql'),
        'json' => extension_loaded('json'),
        'mod_rewrite' => isset($_SERVER['HTACCESS']) || (function_exists('apache_get_modules') && in_array('mod_rewrite', apache_get_modules()))
    ]
];

echo json_encode($serverInfo, JSON_PRETTY_PRINT);
?> 