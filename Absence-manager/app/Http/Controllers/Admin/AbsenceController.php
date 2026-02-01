<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Attendance;
use Inertia\Inertia;

class AbsenceController extends Controller
{
    /**
     * Afficher les détails des absences d'un étudiant
     */
    public function studentAbsences($studentId)
    {
        $student = Student::with('user')->findOrFail($studentId);
        
        // Récupérer toutes les absences de l'étudiant
        $absences = Attendance::where('student_id', $studentId)
            ->where('status', '!=', 'present')
            ->with('classSession.module.professor.user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'status' => $attendance->status,
                    'date' => $attendance->date,
                    'marked_at' => $attendance->marked_at,
                    'notes' => $attendance->notes,
                    'module_name' => $attendance->classSession?->module->name ?? 'Module supprimé',
                    'professor_name' => $attendance->classSession?->module->professor->user->name ?? 'N/A',
                    'class_session_id' => $attendance->classSession?->id,
                ];
            });

        // Compter les absences
        $absenceCount = $absences->count();
        $totalSessions = Attendance::where('student_id', $studentId)->count();
        
        return Inertia::render('Admin/StudentAbsences', [
            'student' => [
                'id' => $student->id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'academic_mention' => $student->academic_mention,
            ],
            'absences' => $absences,
            'absenceCount' => $absenceCount,
            'totalSessions' => $totalSessions,
        ]);
    }
}
