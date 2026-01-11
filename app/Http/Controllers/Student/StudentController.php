<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\ClassSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentController extends Controller
{
    // ========== DASHBOARD ==========
    public function dashboard()
    {
        $student = auth()->user()->student;
        
        $modules = $student->modules()->pluck('modules.id');

        $sessions = ClassSession::whereIn('module_id', $modules)
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
                $attendance = Attendance::where('student_id', $student->id)
                    ->where('class_session_id', $session->id)
                    ->first();

                return [
                    'id' => $session->id,
                    'module_name' => $session->module->name,
                    'module_id' => $session->module->id,
                    'professor_name' => $session->module->professor->user->name,
                    'started_at' => $session->started_at->format('d/m/Y H:i'),
                    'started_at_raw' => $session->started_at,
                    'status' => $session->status,
                    'attendance' => $attendance ? [
                        'id' => $attendance->id,
                        'status' => $attendance->status,
                        'marked_at' => $attendance->marked_at,
                    ] : null,
                ];
            })
            ->toArray();

        $totalSessions = count($sessions);
        $presentCount = count(array_filter($sessions, function ($s) {
            return $s['attendance'] && $s['attendance']['status'] === 'present';
        }));
        $absentCount = $totalSessions - $presentCount;
        $attendanceRate = $totalSessions > 0 ? round(($presentCount / $totalSessions) * 100, 2) : 0;

        return Inertia::render('Student/Dashboard', [
            'sessions' => $sessions,
            'stats' => [
                'total_sessions' => $totalSessions,
                'present_count' => $presentCount,
                'absent_count' => $absentCount,
                'attendance_rate' => $attendanceRate,
            ],
        ]);
    }

    // ========== MODULES ==========
    public function modules()
    {
        $student = auth()->user()->student;
        $modules = $student->modules()
            ->with('professor.user', 'schoolClass')
            ->get();

        return Inertia::render('Student/StudentModules', [
            'modules' => $modules,
        ]);
    }

    // ========== MARQUER PRÉSENCE ==========
    public function markPresenceForm()
    {
        return Inertia::render('Student/MarkPresence');
    }

    public function markPresence(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $student = auth()->user()->student;

        $session = ClassSession::where('code', $validated['code'])
            ->where('status', 'active')
            ->first();

        if (!$session) {
            return redirect()->back()->with('error', '❌ Code invalide ou séance non active.');
        }

        if (!$student->modules->contains($session->module_id)) {
            return redirect()->back()->with('error', '❌ Vous n\'êtes pas inscrit à ce module.');
        }

        $existingAttendance = Attendance::where('student_id', $student->id)
            ->where('class_session_id', $session->id)
            ->first();

        if ($existingAttendance) {
            return redirect()->back()->with('error', '✅ Vous avez déjà marqué votre présence.');
        }

        Attendance::create([
            'student_id' => $student->id,
            'class_session_id' => $session->id,
            'date' => $session->started_at->toDateString(),
            'module_id' => $session->module_id,
            'status' => 'present',
            'marked_at' => now(),
        ]);

        return redirect()->back()->with('success', '✅ Présence marquée avec succès !');
    }

// ========== LETTRES DE RECOMMANDATION ==========
public function letters()
{
    $student = auth()->user()->student;
    
    $requests = $student->recommendationRequests()
        ->with('professor.user', 'letter', 'module')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($request) {
            return [
                'id' => $request->id,
                'status' => $request->status,
                'mention' => $request->mention,
                'rejection_reason' => $request->rejection_reason,
                'created_at' => $request->created_at,
                'professor' => [
                    'id' => $request->professor->id,
                    'user' => [
                        'id' => $request->professor->user->id,
                        'name' => $request->professor->user->name,
                    ],
                ],
                'module' => [
                    'id' => $request->module->id,
                    'name' => $request->module->name,
                ],
                'has_letter' => $request->letter !== null,
                'letter' => $request->letter,
            ];
        });

    // ✅ RÉCUPÉRER LES MODULES DE L'ÉTUDIANT AVEC LEURS MENTIONS
    $modulesWithGrades = $student->modules()
        ->with([
            'professor.user',
            'moduleGrades' => function ($query) use ($student) {
                $query->where('student_id', $student->id);
            }
        ])
        ->get()
        ->map(fn($module) => [
            'id' => $module->id,
            'name' => $module->name,
            'professor' => [
                'id' => $module->professor->id,
                'user' => [
                    'id' => $module->professor->user->id,
                    'name' => $module->professor->user->name,
                ],
            ],
            'mention' => $module->moduleGrades->first()?->mention ?? 'Passable',
        ]);

    return Inertia::render('Student/RequestLetter', [
        'myRequests' => $requests,
        'modulesWithGrades' => $modulesWithGrades,
    ]);
}

public function requestLetter(Request $request)
{
    $validated = $request->validate([
        'module_id' => 'required|exists:modules,id',
    ]);

    $student = auth()->user()->student;
    $module = Module::findOrFail($validated['module_id']);

    // Vérifier que l'étudiant est inscrit à ce module
    if (!$student->modules()->where('module_id', $module->id)->exists()) {
        return redirect()->back()->with('error', 'Vous n\'êtes pas inscrit à ce module.');
    }

    // ✅ RÉCUPÉRER LA MENTION DU PROF POUR CE MODULE
    $moduleGrade = $student->moduleGrades()
        ->where('module_id', $module->id)
        ->first();

    $mention = $moduleGrade?->mention ?? 'Passable';

    // Créer la demande
    $student->recommendationRequests()->create([
        'professor_id' => $module->professor_id,
        'module_id' => $module->id,
        'mention' => $mention,
        'status' => 'pending',
    ]);

    return redirect()->back()->with('success', '✅ Demande de lettre envoyée !');
}

    public function downloadLetter($requestId)
    {
        $student = auth()->user()->student;
        $recommendationRequest = $student->recommendationRequests()->findOrFail($requestId);

        if ($recommendationRequest->status !== 'accepted') {
            return redirect()->back()->with('error', 'Cette demande n\'a pas encore été acceptée.');
        }

        $letter = $recommendationRequest->letter;
        
        if (!$letter || !$letter->file_path) {
            return redirect()->back()->with('error', 'Le PDF n\'est pas disponible.');
        }

        if (!Storage::disk('local')->exists($letter->file_path)) {
            return redirect()->back()->with('error', 'Le fichier PDF n\'existe pas sur le serveur.');
        }

        return Storage::disk('local')->download($letter->file_path, 'lettre_recommandation.pdf');
    }
}