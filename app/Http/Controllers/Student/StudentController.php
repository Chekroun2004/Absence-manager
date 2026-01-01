<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ClassSession;
use App\Models\Attendance;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function modules()
    {
        $user = auth()->user();
        $student = $user->student;
        $modules = $student->modules()->with('professor.user', 'schoolClass')->get();

        return inertia('Student/StudentModules', [
            'modules' => $modules,
        ]);
    }

    public function markPresenceForm()
    {
        return inertia('Student/MarkPresence');
    }

    public function markPresence(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|size:6',
        ]);

        // Récupérer l'étudiant
        $student = auth()->user()->student;
        if (!$student) {
            return redirect()->back()->withErrors(['code' => 'Profil étudiant non trouvé']);
        }

        // Chercher la séance avec ce code
        $session = ClassSession::where('code', strtoupper($validated['code']))
            ->first();

        if (!$session) {
            return redirect()->back()->withErrors(['code' => 'Code invalide']);
        }

        // Vérifier que le code n'a pas expiré
        if (now() > $session->expires_at) {
            return redirect()->back()->withErrors(['code' => 'Code expiré']);
        }

        // Vérifier que l'étudiant est assigné à ce module
        $isAssigned = $student->modules()
            ->where('module_id', $session->module_id)
            ->exists();

        if (!$isAssigned) {
            return redirect()->back()->withErrors(['code' => 'Vous n\'êtes pas assigné à ce module']);
        }

        // Vérifier si présence déjà marquée
        $existingAttendance = Attendance::where('student_id', $student->id)
            ->where('class_session_id', $session->id)
            ->first();

        if ($existingAttendance) {
            return redirect()->back()->withErrors(['code' => 'Vous avez déjà marqué votre présence']);
        }

        // Créer l'enregistrement de présence
        Attendance::create([
            'student_id' => $student->id,
            'class_session_id' => $session->id,
            'module_id' => $session->module_id,
            'is_present' => true,
            'marked_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Présence marquée avec succès !');
    }

    public function letters()
    {
        return inertia('Student/RequestLetter');
    }
}