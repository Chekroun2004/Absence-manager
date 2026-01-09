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
        
        // Récupérer tous les modules de l'étudiant
        $modules = $student->modules()->pluck('modules.id');

        // Récupérer toutes les séances de ses modules
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
                        'status' => $attendance->status,  // ✅ CHANGÉ de 'is_present' à 'status'
                        'marked_at' => $attendance->marked_at,
                    ] : null,
                ];
            })
            ->toArray();

        // Calculer les statistiques
        $totalSessions = count($sessions);
        // ✅ CHANGÉ: Utiliser 'status === present' au lieu de 'is_present'
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
            ->with('professor.user')
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

        // Trouver la séance active avec ce code
        $session = ClassSession::where('code', $validated['code'])
            ->where('status', 'active')
            ->first();

        if (!$session) {
            return redirect()->back()->with('error', '❌ Code invalide ou séance non active.');
        }

        // Vérifier que l'étudiant est inscrit au module
        if (!$student->modules->contains($session->module_id)) {
            return redirect()->back()->with('error', '❌ Vous n\'êtes pas inscrit à ce module.');
        }

        // Vérifier s'il a déjà marqué sa présence
        $existingAttendance = Attendance::where('student_id', $student->id)
            ->where('class_session_id', $session->id)
            ->first();

        if ($existingAttendance) {
            return redirect()->back()->with('error', '✅ Vous avez déjà marqué votre présence.');
        }

        // ✅ CRÉER L'ENREGISTREMENT DE PRÉSENCE AVEC module_id
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
        
        // ✅ CHARGER ET MAPPER LES REQUÊTES AVEC has_letter
        $requests = $student->recommendationRequests()
            ->with('professor.user', 'letter')
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
                    'has_letter' => $request->letter !== null,  // ✅ AJOUTER CECI
                    'letter' => $request->letter,
                ];
            });

        // ✅ RÉCUPÉRER LES PROFESSEURS DE L'ÉTUDIANT
        $professors = $student->modules()
            ->with('professor.user')
            ->get()
            ->pluck('professor')
            ->unique('id')
            ->values();

        return Inertia::render('Student/RequestLetter', [
            'myRequests' => $requests,
            'professors' => $professors,
        ]);
    }

    public function requestLetter(Request $request)
    {
        $validated = $request->validate([
            'professor_id' => 'required|exists:professors,id',
            'mention' => 'required|string|max:255',
        ]);

        $student = auth()->user()->student;

        // Vérifier que l'étudiant a suivi un cours avec ce professeur
        $hasClass = $student->modules()
            ->where('professor_id', $validated['professor_id'])
            ->exists();

        if (!$hasClass) {
            return redirect()->back()->with('error', 'Vous n\'avez pas suivi de cours avec ce professeur.');
        }

        // Créer la demande
        $student->recommendationRequests()->create([
            'professor_id' => $validated['professor_id'],
            'mention' => $validated['mention'],
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

    // ✅ UTILISER LE DISQUE 'local' (pas 'private')
    if (!Storage::disk('local')->exists($letter->file_path)) {
        return redirect()->back()->with('error', 'Le fichier PDF n\'existe pas sur le serveur.');
    }

    return Storage::disk('local')->download($letter->file_path, 'lettre_recommandation.pdf');
}
}