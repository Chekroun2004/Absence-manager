<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ClassSession;
use App\Models\Attendance;
use App\Models\RecommendationRequest;
use App\Models\RecommendationLetter;
use App\Models\Student;
use App\Models\Professor;
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
            'status' => 'present',
            'marked_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Présence marquée avec succès !');
    }

    // ✅ NOUVELLE MÉTHODE 1 : Afficher les demandes et lettres
    public function letters()
    {
        $user = auth()->user();
        $student = $user->student;

        if (!$student) {
            abort(403, 'Profil étudiant non trouvé.');
        }

        // Récupérer tous les professeurs (pour le formulaire)
        $professors = Professor::with('user')->get()->map(function ($prof) {
            return [
                'id' => $prof->id,
                'user' => [
                    'name' => $prof->user->name,
                    'email' => $prof->user->email,
                ],
            ];
        });

        // Récupérer les demandes de l'étudiant
        $myRequests = RecommendationRequest::where('student_id', $student->id)
            ->with(['professor.user', 'letter'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'professor_name' => $request->professor->user->name,
                    'professor_email' => $request->professor->user->email,
                    'status' => $request->status,
                    'has_letter' => $request->letter ? true : false,
                    'letter_path' => $request->letter?->file_path,
                    'rejection_reason' => $request->rejection_reason,
                    'created_at' => $request->created_at->format('d/m/Y H:i'),
                    'responded_at' => $request->responded_at?->format('d/m/Y H:i'),
                ];
            });

        return inertia('Student/RequestLetter', [
            'professors' => $professors,
            'myRequests' => $myRequests,
        ]);
    }

    // ✅ NOUVELLE MÉTHODE 2 : Soumettre une demande
    public function requestLetter(Request $request)
    {
        $user = auth()->user();
        $student = $user->student;

        if (!$student) {
            return redirect()->back()->withErrors(['error' => 'Profil étudiant non trouvé']);
        }

        $validated = $request->validate([
            'professor_id' => 'required|exists:professors,id',
        ]);

        // Vérifier si une demande est déjà en attente
        $existingPending = RecommendationRequest::where('student_id', $student->id)
            ->where('professor_id', $validated['professor_id'])
            ->where('status', 'pending')
            ->first();

        if ($existingPending) {
            return redirect()->back()->withErrors(['error' => 'Une demande est déjà en attente pour ce professeur']);
        }

        // Créer la demande
        RecommendationRequest::create([
            'student_id' => $student->id,
            'professor_id' => $validated['professor_id'],
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Demande envoyée avec succès !');
    }

    // ✅ NOUVELLE MÉTHODE 3 : Télécharger la lettre PDF
    public function downloadLetter(RecommendationRequest $request)
    {
        $user = auth()->user();
        $student = $user->student;

        // Vérifier que c'est bien la lettre de cet étudiant
        if ($request->student_id !== $student->id) {
            abort(403, 'Non autorisé.');
        }

        if (!$request->letter) {
            abort(404, 'Lettre non trouvée.');
        }

        $path = storage_path('app/' . $request->letter->file_path);

        if (!file_exists($path)) {
            abort(404, 'Fichier non trouvé.');
        }

        return response()->download(
            $path,
            'lettre_recommandation_' . $student->user->name . '.pdf'
        );
    }
}