<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
    
class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (auth()->user()->role !== $role) {
            abort(403, 'Accès refusé. Vous n\'avez pas les permissions nécessaires.');
        }

        return $next($request);
    }
}