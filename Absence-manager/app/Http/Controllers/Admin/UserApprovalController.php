<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserApprovalController extends Controller
{
    public function index()
    {
        // Vérifie que c'est un admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Accès refusé');
        }

        $pendingUsers = User::where('is_approved', false)
            ->where('role', '!=', 'admin')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/PendingUsers', [
            'users' => $pendingUsers,
        ]);
    }

    public function approve(User $user)
    {
        // Vérifie que c'est un admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Accès refusé');
        }

        if ($user->role === 'admin') {
            return back()->with('error', 'Action non autorisée.');
        }

        $user->update(['is_approved' => true]);

        return back()->with('success', "Utilisateur {$user->name} approuvé avec succès.");
    }

    public function reject(User $user)
    {
        // Vérifie que c'est un admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Accès refusé');
        }

        if ($user->role === 'admin') {
            return back()->with('error', 'Action non autorisée.');
        }

        $user->delete();

        return back()->with('success', "Utilisateur {$user->name} rejeté et supprimé.");
    }
}