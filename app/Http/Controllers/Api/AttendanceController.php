<?php

namespace App\Http\Controllers\Api;

use App\Models\Attendance;
use App\Models\ClassSession;
use App\Models\Lesson;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    // ✅ NOUVELLE MÉTHODE : Marquer la présence par code avec vérification d'expiration
    public function markPresentByCode(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20',
        ]);

        $student = Student::where('user_id', auth()->id())->firstOrFail();
        
        // Trouver la session active avec ce code
        $session = ClassSession::where('code', $validated['code'])
            ->where('status', 'active')
            ->first();

        if (!$session) {
            return response()->json([
                'error' => '❌ Code invalide ou session n\'existe pas'
            ], 401);
        }

        // ✅ VÉRIFICATION : Vérifier si le code est expiré
        $now = Carbon::now();
        $isExpired = $now->isAfter($session->expires_at);
        
        // Calculer le délai de retard si expiré
        $delaySeconds = 0;
        $status = 'present';
        
        if ($isExpired) {
            $delaySeconds = $now->diffInSeconds($session->expires_at);
            $status = 'absent'; // ❌ Marqué absent si le code est expiré
        }

        // ✅ VÉRIFICATION : Vérifier si présence existe déjà
        $attendance = Attendance::where('class_session_id', $session->id)
            ->where('student_id', $student->id)
            ->first();

        if ($attendance) {
            // Si présence existe et le NEW code n'est pas expiré, METTRE À JOUR en "present"
            if (!$isExpired && $attendance->status === 'absent') {
                // Mise à jour de absent vers present avec le nouveau code rafraîchi
                $attendance->update([
                    'status' => 'present',
                    'marked_at' => $now,
                ]);
                
                return response()->json([
                    'message' => '✅ Présence mise à jour en PRESENT ! (Le code a été rafraîchi)',
                    'status' => 'present',
                    'is_expired' => false,
                    'delay_seconds' => 0,
                    'attendance' => $attendance,
                ], 200);
            }
            
            // Si présence existe et on essaie d'enregistrer à nouveau
            return response()->json([
                'error' => '✅ Votre présence a déjà été enregistrée',
                'current_status' => $attendance->status,
            ], 400);
        }

        // ✅ CRÉER L'ENREGISTREMENT D'ATTENDANCE
        $attendance = Attendance::create([
            'class_session_id' => $session->id,
            'module_id' => $session->module_id,
            'student_id' => $student->id,
            'date' => now()->toDateString(),
            'status' => $status,
            'marked_at' => $now,
        ]);

        // Retourner un message approprié
        $message = $isExpired 
            ? "⏰ Le code a expiré il y a {$delaySeconds}s - Marqué ABSENT. Le professeur peut rafraîchir le code."
            : '✅ Présence marquée avec succès !';

        return response()->json([
            'message' => $message,
            'status' => $status,
            'is_expired' => $isExpired,
            'delay_seconds' => $delaySeconds,
            'attendance' => $attendance,
        ], 201);
    }

    // Marquer la présence (étudiant)
    public function markPresent(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'code' => 'required|string',
        ]);

        $lesson = Lesson::findOrFail($validated['lesson_id']);

        // Vérifier si le code est correct et pas expiré
        if ($lesson->dynamic_code !== $validated['code'] || 
            Carbon::now()->isAfter($lesson->code_expires_at)) {
            return response()->json([
                'error' => 'Code invalide ou expiré'
            ], 401);
        }

        $student = Student::where('user_id', auth()->id())->firstOrFail();

        // Vérifier si déjà marqué
        $attendance = Attendance::where('lesson_id', $lesson->id)
            ->where('student_id', $student->id)
            ->first();

        if ($attendance) {
            return response()->json([
                'error' => 'Présence déjà enregistrée'
            ], 400);
        }

        $attendance = Attendance::create([
            'lesson_id' => $lesson->id,
            'student_id' => $student->id,
            'status' => 'present',
            'marked_at' => Carbon::now(),
        ]);

        return response()->json($attendance, 201);
    }

    // Ajouter une justification d'absence
    public function addJustification(Request $request, $attendanceId)
    {
        $validated = $request->validate([
            'justification' => 'required|string|min:10',
        ]);

        $attendance = Attendance::findOrFail($attendanceId);

        // Vérifier que c'est l'étudiant concerné
        if ($attendance->student->user_id !== auth()->id()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $attendance->update([
            'status' => 'justified',
            'justification' => $validated['justification'],
        ]);

        return response()->json($attendance);
    }

    // Récupérer l'historique des absences d'un étudiant
    public function studentHistory()
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();

        $absences = Attendance::where('student_id', $student->id)
            ->where('status', '!=', 'present')
            ->with('lesson.module')
            ->latest()
            ->get();

        return response()->json($absences);
    }

    // Récupérer les absences d'un module
    public function moduleAbsences($moduleId)
    {
        $absences = Attendance::whereHas('lesson', function ($query) use ($moduleId) {
            $query->where('module_id', $moduleId);
        })
        ->where('status', '!=', 'present')
        ->with('student.user', 'lesson')
        ->get();

        return response()->json($absences);
    }

    // Compter les absences par étudiant
    public function absenceCount($studentId)
    {
        $count = Attendance::where('student_id', $studentId)
            ->where('status', '!=', 'present')
            ->count();

        return response()->json(['absence_count' => $count]);
    }

    // ✅ Récupérer les sessions actives pour l'étudiant
    public function activeSessions(Request $request)
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();

        $sessions = ClassSession::with('module')
            ->where('status', 'active')
            ->whereIn('module_id', $student->modules()->pluck('modules.id'))
            ->select('id', 'module_id', 'code', 'expires_at', 'started_at')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'module_name' => $session->module->name,
                    'code' => $session->code,
                    'expires_at' => $session->expires_at,
                    'started_at' => $session->started_at,
                ];
            });

        return response()->json(['sessions' => $sessions]);
    }
}