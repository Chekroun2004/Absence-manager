<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\ClassSession;
use App\Models\AbsenceJustification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // ========== DASHBOARD ADMIN ==========
        if ($user->role === 'admin') {
            $totalUsers = \App\Models\User::count();
            $totalStudents = \App\Models\Student::count();
            $totalProfessors = \App\Models\Professor::count();
            $totalModules = \App\Models\Module::count();
            $pendingApprovals = \App\Models\User::where('is_approved', false)->count();

            // ✅ ÉTUDIANTS AVEC +3 ABSENCES (optimisé avec query)
            $studentsWithHighAbsence = \App\Models\Student::with('user')
                ->withCount(['attendances as absence_count' => function ($query) {
                    $query->where('status', '!=', 'present');
                }])
                ->having('absence_count', '>=', 3)
                ->get()
                ->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->user->name,
                        'email' => $student->user->email,
                        'absence_count' => (int) $student->absence_count,
                    ];
                })
                ->values();

            return Inertia::render('Dashboard', [
                'role' => 'admin',
                'stats' => [
                    'total_users' => $totalUsers,
                    'total_students' => $totalStudents,
                    'total_professors' => $totalProfessors,
                    'total_modules' => $totalModules,
                    'pending_approvals' => $pendingApprovals,
                ],
                'studentsWithHighAbsence' => $studentsWithHighAbsence,
            ]);
        }

        // ========== DASHBOARD PROFESSEUR ==========
        if ($user->role === 'professor') {
            $professor = $user->professor;
            
            $modules = \App\Models\Module::where('professor_id', $professor->id)
                ->with('students')
                ->get();

            // ✅ COMPTER LES ÉTUDIANTS UNIQUES (pas de doublons)
            $totalStudents = $modules
                ->pluck('students')
                ->flatten()
                ->unique('id')
                ->count();

            $totalSessions = \App\Models\ClassSession::whereIn('module_id', $modules->pluck('id'))->count();
            
            $pendingJustifications = \App\Models\AbsenceJustification::whereHas('attendance', function ($q) use ($modules) {
                $q->whereHas('classSession', function ($qq) use ($modules) {
                    $qq->whereIn('module_id', $modules->pluck('id'));
                });
            })->where('status', 'pending')->count();

            // ✅ SÉANCES ACTIVES (avec ended_at NULL)
            $activeSessions = \App\Models\ClassSession::whereIn('module_id', $modules->pluck('id'))
                ->where('status', 'active')
                ->whereNull('ended_at')
                ->with('module')
                ->orderBy('started_at', 'desc')
                ->get()
                ->map(fn($s) => [
                    'id' => $s->id,
                    'module_name' => $s->module->name,
                    'code' => $s->code,
                    'started_at' => $s->started_at->format('d/m/Y H:i'),
                    'expires_at' => $s->expires_at,
                    'status' => $s->status,
                ]);

            $recentSessions = \App\Models\ClassSession::whereIn('module_id', $modules->pluck('id'))
                ->with('module')
                ->orderBy('started_at', 'desc')
                ->limit(5)
                ->get()
                ->map(fn($s) => [
                    'id' => $s->id,
                    'module_name' => $s->module->name,
                    'started_at' => $s->started_at->format('d/m/Y H:i'),
                    'status' => $s->status,
                ]);

            return Inertia::render('Dashboard', [
                'role' => 'professor',
                'stats' => [
                    'total_modules' => $modules->count(),
                    'total_students' => $totalStudents,
                    'total_sessions' => $totalSessions,
                    'pending_justifications' => $pendingJustifications,
                ],
                'modules' => $modules,
                'activeSessions' => $activeSessions,
                'recentSessions' => $recentSessions,
            ]);
        }

        // ========== DASHBOARD ÉTUDIANT ==========
        if ($user->role === 'student') {
            $student = $user->student;
            $modules = $student->modules()->pluck('modules.id');
            
            $sessions = \App\Models\ClassSession::whereIn('module_id', $modules)
                ->with([
                    'module' => function ($query) {
                        $query->select('id', 'name', 'professor_id');
                    },
                    'module.professor' => function ($query) {
                        $query->select('id', 'user_id');
                        $query->with('user:id,name');
                    },
                ])
                ->orderBy('started_at', 'desc')
                ->get()
                ->map(function ($session) use ($student) {
                    $attendance = \App\Models\Attendance::where('student_id', $student->id)
                        ->where('class_session_id', $session->id)
                        ->first();

                    $justification = null;
                    if ($attendance && $attendance->status !== 'present') {
                        $justification = \App\Models\AbsenceJustification::where('attendance_id', $attendance->id)
                            ->first();
                    }

                    return [
                        'id' => $session->id,
                        'module_name' => $session->module->name,
                        'module_id' => $session->module->id,
                        'professor_name' => $session->module->professor->user->name,
                        'started_at' => $session->started_at->format('d/m/Y H:i'),
                        'status' => $session->status,
                        'attendance' => $attendance ? [
                            'id' => $attendance->id,
                            'status' => $attendance->status,
                            'marked_at' => $attendance->marked_at,
                        ] : null,
                        'justification' => $justification ? [
                            'id' => $justification->id,
                            'status' => $justification->status,
                            'reason' => $justification->reason,
                            'rejection_reason' => $justification->rejection_reason,
                        ] : null,
                    ];
                })
                ->toArray();

            $totalSessions = count($sessions);
            $presentCount = count(array_filter($sessions, fn($s) => $s['attendance'] && $s['attendance']['status'] === 'present'));
            $justifiedCount = count(array_filter($sessions, fn($s) => $s['justification'] && $s['justification']['status'] === 'approved'));
            $absentCount = $totalSessions - $presentCount - $justifiedCount;
            $attendanceRate = $totalSessions > 0 ? round((($presentCount + $justifiedCount) / $totalSessions) * 100, 2) : 0;

            // ✅ VÉRIFIER SI ÉTUDIANT A +3 ABSENCES
            $totalAbsences = Attendance::where('student_id', $student->id)
                ->where('status', '!=', 'present')
                ->count();
            $hasHighAbsence = $totalAbsences >= 3;

            return Inertia::render('Dashboard', [
                'role' => 'student',
                'stats' => [
                    'total_sessions' => $totalSessions,
                    'present_count' => $presentCount,
                    'justified_count' => $justifiedCount,
                    'absent_count' => $absentCount,
                    'attendance_rate' => $attendanceRate,
                    'total_absences' => $totalAbsences,
                    'has_high_absence' => $hasHighAbsence,
                ],
                'sessions' => $sessions,
            ]);
        }
    }
}