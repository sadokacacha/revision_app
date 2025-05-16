<?php
return [

  // only cover the routes your SPA needs
  'paths' => [
    'api/*',
    'sanctum/csrf-cookie',
  ],

  'allowed_methods' => ['*'],

  // your front‑end origin
  'allowed_origins' => [
    'http://localhost:5173',
  ],

  'allowed_origins_patterns' => [],

  'allowed_headers' => ['*'],
  'exposed_headers' => ['Authorization'],
  'max_age' => 0,
    'supports_credentials' => true,
];
