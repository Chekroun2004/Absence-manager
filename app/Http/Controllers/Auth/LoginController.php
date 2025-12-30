<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class LoginController extends Controller
{
    public function attempt(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Cherche l'utilisateur
        $user = \App\Models\User::where('email', $credentials['email'])->first();

        // Si l'utilisateur existe mais n'est pas approuvé
        if ($user && !$user->is_approved) {
            return back()
                ->withInput($request->only('email'))
                ->with('warning', 'Votre compte est en attente d\'approbation. Un administrateur examinera votre demande bientôt.');
        }

        // Essaie de se connecter normalement
        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'));
        }

        // Si l'utilisateur n'existe pas du tout
        return back()
            ->withInput($request->only('email'))
            ->withErrors(['email' => 'Ces identifiants ne correspondent pas à nos enregistrements.']);
    }
}