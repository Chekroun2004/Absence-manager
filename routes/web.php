<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserApprovalController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

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

// Routes Admin - SANS middleware role pour le moment
Route::middleware(['auth', 'approved'])->prefix('admin')->group(function () {
    Route::get('/pending-users', [UserApprovalController::class, 'index'])
        ->name('admin.pending-users');
    Route::post('/users/{user}/approve', [UserApprovalController::class, 'approve'])
        ->name('admin.users.approve');
    Route::delete('/users/{user}/reject', [UserApprovalController::class, 'reject'])
        ->name('admin.users.reject');
});

require __DIR__.'/auth.php';