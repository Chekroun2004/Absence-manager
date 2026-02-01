<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        // Cherche l'utilisateur AVANT de l'authentifier
        $user = \App\Models\User::where('email', $request->email)->first();

        // Si l'utilisateur existe mais n'est pas approuvé
        if ($user && !$user->is_approved) {
            return back()
                ->withInput($request->only('email'))
                ->with('warning', 'Votre compte est en attente d\'approbation. Un administrateur examinera votre demande bientôt.');
        }

        // Authentifie normalement
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}