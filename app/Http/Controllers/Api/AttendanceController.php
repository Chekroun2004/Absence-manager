<?php

namespace App\Http\Controllers\Api;

use App\Models\Attendance;
use App\Models\Lesson;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Carbon\Carbon;

class AttendanceController extends Controller
{
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
}