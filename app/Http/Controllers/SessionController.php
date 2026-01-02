<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\ClassSession;
use App\Models\Module;
use App\Models\Professor;
use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SessionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor) {
            abort(403, 'Vous n\'êtes pas enregistré comme professeur.');
        }

        $modules = $professor->modules()
            ->with('schoolClass', 'students.user')
            ->get()
            ->map(fn($module) => [
                'id' => $module->id,
                'name' => $module->name,
                'class' => $module->schoolClass->name,
                'student_count' => $module->students->count(),
                'students' => $module->students->map(fn($student) => [
                    'id' => $student->id,
                    'user' => [
                        'name' => $student->user->name,
                        'email' => $student->user->email,
                    ],
                ]),
            ]);

        return Inertia::render('Professor/TeachingSessions', [
            'modules' => $modules,
        ]);
    }

    public function start(Module $module)
    {
        $user = Auth::user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor || $module->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        // Générer un code PIN aléatoire (6 caractères)
        $code = strtoupper(substr(
            str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
            0,
            6
        ));

        // Créer la séance
        $session = ClassSession::create([
            'module_id' => $module->id,
            'professor_id' => $professor->id,
            'code' => $code,
            'started_at' => now(),
            'expires_at' => now()->addSeconds(20),
            'status' => 'active',
        ]);

        return redirect()->route('professor.sessions.active', $session->id);
    }

    public function showActive(ClassSession $session)
    {
        $user = Auth::user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor || $session->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        // Récupérer les étudiants du module
        $students = $session->module->students()
            ->with('user')
            ->get()
            ->map(function ($student) use ($session) {
                $attendance = Attendance::where('student_id', $student->id)
                    ->where('class_session_id', $session->id)  // ✅ class_session_id
                    ->first();

                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'is_present' => $attendance && $attendance->status === 'present' ? true : false,
                    'marked_at' => $attendance ? $attendance->marked_at : null,
                ];
            });

        return Inertia::render('Professor/ActiveSession', [
            'session' => [
                'id' => $session->id,
                'code' => $session->code,
                'started_at' => $session->started_at,
                'expires_at' => $session->expires_at,
                'module_name' => $session->module->name,
            ],
            'students' => $students,
        ]);
    }

    // ✅ NOUVELLE MÉTHODE : API pour polling
    public function getAttendances(ClassSession $session)
    {
        $user = Auth::user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor || $session->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        $attendances = Attendance::where('class_session_id', $session->id)  // ✅ class_session_id
            ->with('student.user')
            ->get();

        return response()->json([
            'attendances' => $attendances,
            'session_expired' => now() > $session->expires_at,
        ]);
    }

    public function close(ClassSession $session)
    {
        $user = Auth::user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor || $session->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        $session->update(['status' => 'closed']);

        return redirect()->route('professor.sessions')->with('success', 'Séance fermée');
    }

    public function stats(ClassSession $session)
    {
        $user = Auth::user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor || $session->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        $present = Attendance::where('class_session_id', $session->id)  // ✅ class_session_id
            ->where('status', 'present')
            ->count();
        $total = $session->module->students()->count();
        $absent = $total - $present;

        return Inertia::render('Professor/SessionStats', [
            'session' => [
                'id' => $session->id,
                'code' => $session->code,
                'module_name' => $session->module->name,
            ],
            'present' => $present,
            'absent' => $absent,
            'total' => $total,
        ]);
    }
}