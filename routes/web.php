<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\Admin\UserApprovalController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Professor\RecommendationController;
use App\Http\Controllers\Professor\SessionController as ProfessorSessionController;
use Illuminate\Foundation\Application;
use App\Models\Module;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// ========== ROUTES AUTHENTIFIÉES (Pour tous les utilisateurs approuvés) ==========
Route::middleware(['auth', 'approved'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/attendance/mark', function () {
        return Inertia::render('Attendance/MarkAttendance');
    })->name('attendance.mark');

    Route::get('/attendance/history', function () {
        return Inertia::render('Attendance/AttendanceHistory');
    })->name('attendance.history');

    Route::get('/recommendation/request', function () {
        return Inertia::render('Recommendation/RequestLetter');
    })->name('recommendation.request');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ========== ROUTES ADMIN ==========
Route::middleware(['auth', 'verified', 'approved', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // ========== GESTION DES UTILISATEURS ==========
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // ========== GESTION DES MODULES ==========
        Route::get('/modules', [ModuleController::class, 'index'])->name('modules.index');
        Route::post('/modules', [ModuleController::class, 'store'])->name('modules.store');
        Route::put('/modules/{module}', [ModuleController::class, 'update'])->name('modules.update');
        Route::delete('/modules/{module}', [ModuleController::class, 'destroy'])->name('modules.destroy');
        Route::get('/modules/{module}/assign', [ModuleController::class, 'showAssignForm'])->name('modules.assign-page');
        Route::post('/modules/{module}/assign-students', [ModuleController::class, 'assignStudents'])->name('modules.assign');

        // ========== APPROBATION DES UTILISATEURS ==========
        Route::get('/pending-users', [UserApprovalController::class, 'index'])->name('pending-users');
        Route::post('/users/{user}/approve', [UserApprovalController::class, 'approve'])->name('users.approve');
        Route::post('/users/{user}/reject', [UserApprovalController::class, 'reject'])->name('users.reject');
    });

// ========== ROUTES PROFESSEUR ==========
Route::middleware(['auth', 'verified', 'approved', 'role:professor'])
    ->prefix('professor')
    ->name('professor.')
    ->group(function () {
        // Gestion des séances
        Route::get('/sessions', [
            ProfessorSessionController::class,
            'index',
        ])->name('sessions');

        Route::post('/sessions/{module}/start', [
            ProfessorSessionController::class,
            'start',
        ])->name('sessions.start');

        Route::get('/sessions/{session}/active', [
            ProfessorSessionController::class,
            'showActive',
        ])->name('sessions.active');

        Route::post('/sessions/{session}/close', [
            ProfessorSessionController::class,
            'close',
        ])->name('sessions.close');

        Route::get('/sessions/{session}/stats', [
            ProfessorSessionController::class,
            'stats',
        ])->name('sessions.stats');

        // Gestion des recommandations
        Route::get('/recommendations', [
            RecommendationController::class,
            'index',
        ])->name('recommendations');
    });

// ========== ROUTES ÉTUDIANT ==========
Route::middleware(['auth', 'verified', 'approved', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        // Mes modules
        Route::get('/modules', [
            \App\Http\Controllers\Student\StudentController::class,
            'modules',
        ])->name('modules');

        // Marquer présence
        Route::get('/mark-presence', [
            \App\Http\Controllers\Student\StudentController::class,
            'markPresenceForm',
        ])->name('mark-presence');

        Route::post('/mark-presence', [
            \App\Http\Controllers\Student\StudentController::class,
            'markPresence',
        ])->name('mark-presence.store');

        // Lettres
        Route::get('/letters', [
            \App\Http\Controllers\Student\StudentController::class,
            'letters',
        ])->name('letters');
    });

require __DIR__.'/auth.php';