<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\RecommendationRequest;
use App\Models\Professor;
use App\Services\RecommendationLetterService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    protected $letterService;

    public function __construct(RecommendationLetterService $letterService)
    {
        $this->letterService = $letterService;
    }

    // ✅ Afficher les demandes de recommandation du prof
    public function index()
    {
        $user = auth()->user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor) {
            abort(403, 'Professeur non trouvé.');
        }

        // Récupérer les demandes de ce professeur
        $requests = RecommendationRequest::where('professor_id', $professor->id)
            ->with('student.user', 'letter')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'student_name' => $request->student->user->name,
                    'student_email' => $request->student->user->email,
                    'mention' => $request->student->academic_mention,
                    'status' => $request->status,
                    'has_letter' => $request->letter ? true : false,
                    'letter_path' => $request->letter?->file_path,
                    'created_at' => $request->created_at->format('d/m/Y H:i'),
                    'responded_at' => $request->responded_at?->format('d/m/Y H:i'),
                ];
            });

        return inertia('Professor/Recommendations', [
            'recommendations' => $requests,
        ]);
    }

    // ✅ Accepter une demande et générer la lettre (VERSION CORRIGÉE)
    public function accept(RecommendationRequest $request)
    {
        $user = auth()->user();
        $professor = Professor::where('user_id', $user->id)->first();

        // ❌ Vérifier que le professeur existe
        if (!$professor) {
            return redirect()->back()->withErrors(['error' => 'Profil professeur non trouvé.']);
        }

        // ❌ Vérifier que c'est bien le prof qui reçoit la demande (conversion de type sûre)
        if ((int)$request->professor_id !== (int)$professor->id) {
            return redirect()->back()->withErrors(['error' => 'Cette demande ne vous appartient pas.']);
        }

        // ❌ Vérifier que la demande est en attente
        if ($request->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Demande déjà traitée.']);
        }

        try {
            // Générer la lettre PDF
            $this->letterService->generateLetter($request);

            // Marquer comme acceptée
            $request->update([
                'status' => 'accepted',
                'responded_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Lettre générée et demande acceptée ! ✅');
        } catch (\Exception $e) {
            \Log::error('Erreur génération lettre', [
                'error' => $e->getMessage(),
                'request_id' => $request->id,
                'professor_id' => $professor->id,
            ]);
            return redirect()->back()->withErrors(['error' => 'Erreur lors de la génération: ' . $e->getMessage()]);
        }
    }

    // ✅ Refuser une demande (VERSION CORRIGÉE)
    public function reject(RecommendationRequest $request, Request $httpRequest)
    {
        $user = auth()->user();
        $professor = Professor::where('user_id', $user->id)->first();

        // ❌ Vérifier que le professeur existe
        if (!$professor) {
            return redirect()->back()->withErrors(['error' => 'Profil professeur non trouvé.']);
        }

        // ❌ Vérifier que c'est bien le prof qui reçoit la demande (conversion de type sûre)
        if ((int)$request->professor_id !== (int)$professor->id) {
            return redirect()->back()->withErrors(['error' => 'Cette demande ne vous appartient pas.']);
        }

        // ❌ Vérifier que la demande est en attente
        if ($request->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Demande déjà traitée.']);
        }

        // Valider la raison du refus
        $data = $httpRequest->validate([
            'rejection_reason' => 'required|string|min:10|max:500',
        ]);

        // Mettre à jour la demande
        $request->update([
            'status' => 'rejected',
            'rejection_reason' => $data['rejection_reason'],
            'responded_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Demande refusée. ❌');
    }

    // ✅ Télécharger la lettre PDF (VERSION CORRIGÉE)
    public function downloadLetter(RecommendationRequest $request)
    {
        $user = auth()->user();
        $professor = Professor::where('user_id', $user->id)->first();

        // ❌ Vérifier que le professeur existe
        if (!$professor) {
            abort(403, 'Profil professeur non trouvé.');
        }

        // ❌ Vérifier l'autorisation (conversion de type sûre)
        if ((int)$request->professor_id !== (int)$professor->id) {
            abort(403, 'Non autorisé.');
        }

        // ❌ Vérifier que la lettre existe
        if (!$request->letter) {
            abort(404, 'Lettre non trouvée.');
        }

        // ❌ Vérifier que le fichier existe physiquement
        $path = storage_path('app/' . $request->letter->file_path);

        if (!file_exists($path)) {
            abort(404, 'Fichier non trouvé.');
        }

        return response()->download($path, 'lettre_recommandation.pdf');
    }
}