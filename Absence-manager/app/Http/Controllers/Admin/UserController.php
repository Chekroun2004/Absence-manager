<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Professor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['student', 'professor'])
            ->whereIn('role', ['student', 'professor'])
            ->where('is_approved', 1)
            ->get();

        return inertia('Admin/UserManagement', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:professor,student',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_approved'] = true;

        $user = User::create($validated);

        // ✅ CORRECTION : Ajouter le title pour les professeurs
        if ($validated['role'] === 'professor') {
            Professor::create([
                'user_id' => $user->id,
                'title' => 'Professor',  // ✅ AJOUTER TITLE
            ]);
        } else {
            Student::create([
                'user_id' => $user->id,
                'academic_mention' => 'Assez Bien',
            ]);
        }

        return redirect()->back()->with('success', 'Utilisateur créé');
    }
    
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
        ]);

        if ($validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Utilisateur modifié');
    }

    public function destroy(User $user)
    {
        if ($user->role === 'professor') {
            $user->professor()->delete();
        } else {
            $user->student()->delete();
        }

        $user->delete();

        return redirect()->back()->with('success', 'Utilisateur supprimé');
    }
}