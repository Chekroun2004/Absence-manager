<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\RecommendationRequestController;

Route::middleware(['web'])->group(function () {
    // Présences
    Route::post('/attendance/mark-present', [AttendanceController::class, 'markPresent']);
    Route::get('/attendance/active-sessions', [AttendanceController::class, 'activeSessions']);
    Route::post('/attendance/mark-by-code', [AttendanceController::class, 'markPresentByCode']);
    Route::post('/attendance/{id}/justify', [AttendanceController::class, 'addJustification']);
    Route::get('/attendance/history', [AttendanceController::class, 'studentHistory']);
    Route::get('/modules/{moduleId}/absences', [AttendanceController::class, 'moduleAbsences']);
    Route::get('/students/{studentId}/absence-count', [AttendanceController::class, 'absenceCount']);

    // Leçons
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::post('/lessons/{id}/activate', [LessonController::class, 'activate']);
    Route::post('/lessons/{id}/close', [LessonController::class, 'close']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::get('/modules/{moduleId}/lessons', [LessonController::class, 'byModule']);

    // Lettres de recommandation
    Route::post('/recommendations', [RecommendationRequestController::class, 'store']);
    Route::get('/recommendations/pending', [RecommendationRequestController::class, 'pendingRequests']);
    Route::post('/recommendations/{id}/accept', [RecommendationRequestController::class, 'accept']);
    Route::post('/recommendations/{id}/reject', [RecommendationRequestController::class, 'reject']);
    Route::get('/recommendations/my-requests', [RecommendationRequestController::class, 'studentRequests']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});