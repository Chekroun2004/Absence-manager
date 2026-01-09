<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserApprovalController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SchoolClassController;
use App\Http\Controllers\Professor\RecommendationController;
use App\Http\Controllers\Professor\SessionController as ProfessorSessionController;
use App\Http\Controllers\Professor\AbsenceJustificationController as ProfessorAbsenceJustificationController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\AbsenceJustificationController as StudentAbsenceJustificationController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// ========== ROUTES AUTHENTIFIÉES ==========
Route::middleware(['auth', 'approved'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ========== ROUTES ADMIN ==========
Route::middleware(['auth', 'verified', 'approved', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // ========== GESTION UTILISATEURS ==========
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // ========== GESTION MODULES ==========
        Route::get('/modules', [ModuleController::class, 'index'])->name('modules.index');
        Route::post('/modules', [ModuleController::class, 'store'])->name('modules.store');
        Route::put('/modules/{module}', [ModuleController::class, 'update'])->name('modules.update');
        Route::delete('/modules/{module}', [ModuleController::class, 'destroy'])->name('modules.destroy');
        Route::get('/modules/{module}/assign', [ModuleController::class, 'showAssignForm'])->name('modules.assign-page');
        Route::post('/modules/{module}/assign-students', [ModuleController::class, 'assignStudents'])->name('modules.assign');

        // ========== GESTION CLASSES ==========
        Route::get('/school-classes', [SchoolClassController::class, 'index'])->name('school-classes.index');
        Route::post('/school-classes', [SchoolClassController::class, 'store'])->name('school-classes.store');
        Route::put('/school-classes/{schoolClass}', [SchoolClassController::class, 'update'])->name('school-classes.update');
        Route::delete('/school-classes/{schoolClass}', [SchoolClassController::class, 'destroy'])->name('school-classes.destroy');

        // ========== APPROBATION UTILISATEURS ==========
        Route::get('/pending-users', [UserApprovalController::class, 'index'])->name('pending-users');
        Route::post('/users/{user}/approve', [UserApprovalController::class, 'approve'])->name('users.approve');
        Route::post('/users/{user}/reject', [UserApprovalController::class, 'reject'])->name('users.reject');
    });

// ========== ROUTES PROFESSEUR ==========
Route::middleware(['auth', 'verified', 'approved', 'role:professor'])
    ->prefix('professor')
    ->name('professor.')
    ->group(function () {
        // ========== GESTION SÉANCES ==========
        Route::get('/sessions', [ProfessorSessionController::class, 'index'])->name('sessions');
        Route::post('/sessions/{module}/start', [ProfessorSessionController::class, 'start'])->name('sessions.start');
        Route::get('/sessions/{session}/active', [ProfessorSessionController::class, 'showActive'])->name('sessions.active');
        Route::post('/sessions/{session}/close', [ProfessorSessionController::class, 'close'])->name('sessions.close');
        Route::get('/sessions/{session}/stats', [ProfessorSessionController::class, 'stats'])->name('sessions.stats');
        Route::get('/sessions/{session}/attendances', [ProfessorSessionController::class, 'getAttendances'])->name('sessions.attendances');

        // ========== JUSTIFICATIONS ABSENCES ==========
        Route::get('/absences/justifications', [ProfessorAbsenceJustificationController::class, 'index'])->name('absences.justifications');
        Route::post('/absences/justifications/{justification}/approve', [ProfessorAbsenceJustificationController::class, 'approve'])->name('absences.justifications.approve');
        Route::post('/absences/justifications/{justification}/reject', [ProfessorAbsenceJustificationController::class, 'reject'])->name('absences.justifications.reject');
        Route::get('/absences/justifications/{justification}/download', [ProfessorAbsenceJustificationController::class, 'downloadFile'])->name('absences.justifications.download');

        // ========== LETTRES RECOMMANDATION ==========
        Route::get('/recommendations', [RecommendationController::class, 'index'])->name('recommendations');
        Route::post('/recommendations/{request}/accept', [RecommendationController::class, 'accept'])->name('recommendations.accept');
        Route::post('/recommendations/{request}/reject', [RecommendationController::class, 'reject'])->name('recommendations.reject');
        Route::get('/recommendations/{request}/download', [RecommendationController::class, 'downloadLetter'])->name('recommendations.download');
    });

// ========== ROUTES ÉTUDIANT ==========
Route::middleware(['auth', 'verified', 'approved', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        // ========== MODULES ==========
        Route::get('/modules', [StudentController::class, 'modules'])->name('modules');
        
        // ========== PRÉSENCES ==========
        Route::get('/mark-presence', [StudentController::class, 'markPresenceForm'])->name('mark-presence');
        Route::post('/mark-presence', [StudentController::class, 'markPresence'])->name('mark-presence.store');

        // ========== LETTRES RECOMMANDATION ==========
        Route::get('/letters', [StudentController::class, 'letters'])->name('letters');
        Route::post('/letters/request', [StudentController::class, 'requestLetter'])->name('letters.request');
        Route::get('/letters/{request}/download', [StudentController::class, 'downloadLetter'])->name('letters.download');

        // ========== JUSTIFICATIONS ABSENCES ==========
        Route::post('/absences/{session}/justify', [StudentAbsenceJustificationController::class, 'store'])->name('justifications.store');
        Route::get('/justifications/{justification}/download', [StudentAbsenceJustificationController::class, 'downloadFile'])->name('justifications.download');
    });

require __DIR__.'/auth.php';