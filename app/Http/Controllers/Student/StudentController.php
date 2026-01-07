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
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    /**
     * Afficher les modules de l'étudiant
     */
    public function modules()
    {
        $user = auth()->user();
        $student = $user->student;
        $modules = $student->modules()->with('professor.user', 'schoolClass')->get();

        return inertia('Student/StudentModules', [
            'modules' => $modules,
        ]);
    }

    /**
     * Afficher le formulaire pour marquer la présence
     */
    public function markPresenceForm()
    {
        return inertia('Student/MarkPresence');
    }

    /**
     * Marquer la présence
     */
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
            return redirect()->back()->withErrors(['code' => '❌ Code invalide']);
        }

        // Vérifier que le code n'a pas expiré
        if (now() > $session->expires_at) {
            return redirect()->back()->withErrors(['code' => '❌ Code expiré']);
        }

        // Vérifier que l'étudiant est assigné à ce module
        $isAssigned = $student->modules()
            ->where('module_id', $session->module_id)
            ->exists();

        if (!$isAssigned) {
            return redirect()->back()->withErrors(['code' => '❌ Non assigné à ce module']);
        }

        // Vérifier si présence déjà marquée
        $existingAttendance = Attendance::where('student_id', $student->id)
            ->where('class_session_id', $session->id)
            ->first();

        if ($existingAttendance) {
            return redirect()->back()->withErrors(['code' => '⚠️ Présence déjà marquée']);
        }

        // Créer l'enregistrement de présence
        Attendance::create([
            'student_id' => $student->id,
            'class_session_id' => $session->id,
            'module_id' => $session->module_id,
            'status' => 'present',
            'marked_at' => now(),
            'date' => now()->toDateString(),
        ]);

        return redirect()->back()->with('success', '✅ Présence marquée avec succès !');
    }

    /**
     * Afficher les lettres de recommandation
     */
    /**
 * Afficher les lettres de recommandation
 */
public function letters()
{
    $user = auth()->user();
    $student = $user->student;

    if (!$student) {
        abort(403, 'Profil étudiant non trouvé.');
    }

    // Tous les professeurs
    $professors = Professor::with('user')->get();

    // Demandes de l'étudiant avec les lettres associées
    $myRequests = RecommendationRequest::where('student_id', $student->id)
        ->with(['professor.user', 'letter'])  // ✅ Charger la relation letter
        ->orderByDesc('created_at')
        ->get()
        ->map(function ($request) {
            return [
                'id' => $request->id,
                'professor' => [
                    'user' => [
                        'name' => $request->professor->user->name,
                        'email' => $request->professor->user->email,
                    ]
                ],
                'mention' => $request->mention,
                'status' => $request->status,
                'has_letter' => $request->letter ? true : false,  // ✅ AJOUTER
                'rejection_reason' => $request->rejection_reason,
                'created_at' => $request->created_at->format('d/m/Y'),
            ];
        });

    return inertia('Student/RequestLetter', [
        'professors' => $professors,
        'myRequests' => $myRequests,
    ]);
}

    /**
     * Soumettre une demande de lettre
     */
    public function requestLetter(Request $request)
    {
        $user = auth()->user();
        $student = $user->student;

        if (!$student) {
            return redirect()->back()->withErrors(['error' => 'Profil étudiant non trouvé']);
        }

        $validated = $request->validate([
            'professor_id' => 'required|exists:professors,id',
            'mention' => 'required|in:Très Bien,Bien,Assez Bien,Passable',
        ]);

        // Vérifier si une demande est déjà en attente
        $existingPending = RecommendationRequest::where('student_id', $student->id)
            ->where('professor_id', $validated['professor_id'])
            ->where('status', 'pending')
            ->first();

        if ($existingPending) {
            return redirect()->back()->withErrors(['error' => 'Demande déjà en attente pour ce professeur']);
        }

        // Créer la demande
        RecommendationRequest::create([
            'student_id' => $student->id,
            'professor_id' => $validated['professor_id'],
            'mention' => $validated['mention'],
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', '✅ Demande envoyée avec succès !');
    }

    /**
 * Télécharger une lettre PDF
 */
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

    // ✅ Utiliser Storage::download() au lieu de response()->download()
    $filePath = $request->letter->file_path;

    if (!Storage::exists($filePath)) {
        \Log::error('❌ Fichier non trouvé', [
            'file_path' => $filePath,
            'full_path' => storage_path('app/' . $filePath),
        ]);
        abort(404, 'Fichier non trouvé : ' . $filePath);
    }

    return Storage::download(
        $filePath,
        'lettre_recommandation_' . $student->user->name . '.pdf'
    );
    }
}
