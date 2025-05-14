<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\Traits\HasRoles;

class RoleMiddleware
{
    use HasRoles;

    public function handle(Request $request, Closure $next, $role)
    {
        if (auth()->check() && auth()->user()->hasRole($role)) {
            return $next($request);
        }

        abort(403, 'Unauthorized action.');
    }
}
