<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\ClassSession;
use App\Models\Module;
use App\Models\Professor;
use App\Models\ModuleStudentGrade;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
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

        $allStudents = $professor->modules()
            ->with('students')
            ->get()
            ->pluck('students')
            ->flatten()
            ->unique('id')
            ->count();

        return Inertia::render('Professor/TeachingSessions', [
            'modules' => $modules,
            'total_unique_students' => $allStudents,
        ]);
    }

    public function start(Module $module)
    {
        $user = Auth::user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor || $module->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        $code = strtoupper(substr(
            str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
            0,
            6
        ));

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

    public function close(ClassSession $session)
    {
        if ($session->professor_id !== auth()->user()->professor->id) {
            abort(403, 'Non autorisé');
        }

        $students = $session->module->students()->pluck('students.id');

        foreach ($students as $student_id) {
            $attendance = Attendance::where('class_session_id', $session->id)
                ->where('student_id', $student_id)
                ->first();

            if (!$attendance) {
                Attendance::create([
                    'student_id' => $student_id,
                    'module_id' => $session->module_id,
                    'class_session_id' => $session->id,
                    'date' => $session->started_at->toDateString(),
                    'status' => 'absent',
                    'marked_at' => now(),
                ]);
            }
        }

        $session->update(['status' => 'closed', 'ended_at' => now()]);

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

    public function getAttendances(ClassSession $session)
    {
        $user = Auth::user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor || $session->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        $attendances = Attendance::where('class_session_id', $session->id)
            ->select('id', 'student_id', 'status', 'marked_at', 'date')
            ->with('student.user:id,name,email')
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'student_id' => $attendance->student_id,
                    'status' => $attendance->status,
                    'marked_at' => $attendance->marked_at,
                    'date' => $attendance->date,
                    'student_name' => $attendance->student->user->name,
                    'student_email' => $attendance->student->user->email,
                ];
            });

        \Log::info('🔍 getAttendances - Session: ' . $session->id);
        \Log::info('🔍 Nombre d\'attendances: ' . $attendances->count());
        \Log::info('🔍 Présents: ' . $attendances->where('status', 'present')->count());

        return response()->json([
            'attendances' => $attendances,
            'session_expired' => now() > $session->expires_at,
        ]);
    }

    // ========== GESTION MENTIONS (PROPRES MODULES) ==========
    public function gradesIndex()
    {
        $professor = auth()->user()->professor;
        $modules = $professor->modules()
            ->with('schoolClass')
            ->get()
            ->map(fn($module) => [
                'id' => $module->id,
                'name' => $module->name,
                'schoolClass' => [
                    'name' => $module->schoolClass->name,
                ],
            ]);

        return Inertia::render('Professor/StudentGrades', [
            'modules' => $modules,
        ]);
    }

    public function gradesModule(Module $module)
    {
        $professor = auth()->user()->professor;

        if ($module->professor_id !== $professor->id) {
            abort(403, 'Non autorisé');
        }

        $students = $module->students()
            ->with(['moduleGrades' => function ($query) use ($module) {
                $query->where('module_id', $module->id);
            }, 'user'])
            ->get()
            ->map(fn($student) => [
                'id' => $student->id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'gradeId' => $student->moduleGrades->first()?->id,
                'mention' => $student->moduleGrades->first()?->mention ?? 'Passable',
            ]);

        return Inertia::render('Professor/StudentGradesEdit', [
            'module' => [
                'id' => $module->id,
                'name' => $module->name,
                'class' => $module->schoolClass->name,
            ],
            'students' => $students,
        ]);
    }

    public function updateGrade(ModuleStudentGrade $moduleStudentGrade, Request $request)
    {
        $professor = auth()->user()->professor;
        $module = $moduleStudentGrade->module;

        if ($module->professor_id !== $professor->id) {
            abort(403, 'Non autorisé');
        }

        $validated = $request->validate([
            'mention' => 'required|in:Très Bien,Bien,Assez Bien,Passable',
        ]);

        $moduleStudentGrade->update(['mention' => $validated['mention']]);

        return redirect()->back()->with('success', '✅ Mention mise à jour !');
    }
}