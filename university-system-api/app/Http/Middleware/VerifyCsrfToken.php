<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     */
    protected $except = [
        // This stops the server from blocking the token request
        'sanctum/csrf-cookie',
        // We also exclude all API routes
        'api/*',
    ];
}