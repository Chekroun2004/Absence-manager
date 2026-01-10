<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\ClassSession;
use App\Models\Module;
use App\Models\Professor;
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
                    ->where('class_session_id', $session->id)
                    ->first();

                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'is_present' => $attendance && $attendance->status === 'present' ? true : false,  // ✅ FIXÉ
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

    public function close(ClassSession $session)
{
    // Vérifier autorisation
    if ($session->professor_id !== auth()->user()->professor->id) {
        abort(403, 'Non autorisé');
    }

    // Récupérer les étudiants du module
    $students = $session->module->students()->pluck('students.id');

    // Parcourir TOUS les étudiants
    foreach ($students as $student_id) {
        // Vérifier si l'étudiant a marqué sa présence
        $attendance = Attendance::where('class_session_id', $session->id)
            ->where('student_id', $student_id)
            ->first();

        // ✅ Si pas d'attendance, créer une absence
        if (!$attendance) {
            Attendance::create([
                'student_id' => $student_id,
                'module_id' => $session->module_id,
                'class_session_id' => $session->id,
                'date' => $session->started_at->toDateString(),
                'status' => 'absent',  // ✅ Marquer comme absent
                'marked_at' => now(),
            ]);
        }
    }

    // Clôturer la séance
    $session->update(['status' => 'closed']);

    return redirect()->back()->with('success', '✅ Séance clôturée !');
}

    public function stats(ClassSession $session)
    {
        $user = Auth::user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor || $session->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        $present = Attendance::where('class_session_id', $session->id)
            ->where('status', 'present')  // ✅ FIXÉ
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

    // ✅ API ENDPOINT pour le polling
    // ✅ API ENDPOINT pour le polling
// ✅ API ENDPOINT pour le polling
   public function getAttendances(ClassSession $session)
{
    $user = Auth::user();
    $professor = Professor::where('user_id', $user->id)->first();

    if (!$professor || $session->professor_id !== $professor->id) {
        abort(403, 'Non autorisé.');
    }

    // ✅ RÉCUPÉRER LES PRÉSENCES AVEC LES BONNES COLONNES
    $attendances = Attendance::where('class_session_id', $session->id)
        ->select('id', 'student_id', 'status', 'marked_at', 'date')
        ->with('student.user:id,name,email')
        ->get()
        ->map(function ($attendance) {
            return [
                'id' => $attendance->id,
                'student_id' => $attendance->student_id,
                'status' => $attendance->status,  // ✅ 'present', 'absent', 'late'
                'marked_at' => $attendance->marked_at,
                'date' => $attendance->date,
                'student_name' => $attendance->student->user->name,
                'student_email' => $attendance->student->user->email,
            ];
        });

    // ✅ LOGS DE DEBUG
    \Log::info('🔍 getAttendances - Session: ' . $session->id);
    \Log::info('🔍 Nombre d\'attendances: ' . $attendances->count());
    \Log::info('🔍 Présents: ' . $attendances->where('status', 'present')->count());
    \Log::info('🔍 Data: ' . json_encode($attendances));

    return response()->json([
        'attendances' => $attendances,
        'session_expired' => now() > $session->expires_at,
    ]);
}
}