<?php

return [
    'paths' => [
        'api/*', // This one path covers all your API routes
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register'
    ],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173', // Your frontend URL
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];