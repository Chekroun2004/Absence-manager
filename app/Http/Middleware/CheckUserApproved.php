<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        // Si l'utilisateur est authentifié et pas approuvé
        if ($request->user() && !$request->user()->is_approved) {
            // Logout l'utilisateur
            auth()->logout();
            
            // Invalide la session
            $request->session()->invalidate();
            
            // Redirige vers login avec message
            return redirect()->route('login')->with(
                'warning',
                'Votre compte est en attente d\'approbation par un administrateur. Vous serez notifié dès que votre demande sera traitée.'
            );
        }

        return $next($request);
    }
}