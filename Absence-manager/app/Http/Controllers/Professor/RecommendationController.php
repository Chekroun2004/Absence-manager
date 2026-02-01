<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\RecommendationRequest;
use App\Models\Professor;
use App\Services\RecommendationLetterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Log;

class RecommendationController extends Controller
{
    protected $letterService;

    public function __construct(RecommendationLetterService $letterService)
    {
        $this->letterService = $letterService;
    }

    /**
     * Afficher les demandes de recommandation du prof
     */
    public function index()
    {
        $user = auth()->user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor) {
            abort(403, 'Professeur non trouvé.');
        }

        // Demandes en attente
        $pendingRequests = RecommendationRequest::where('professor_id', $professor->id)
            ->where('status', 'pending')
            ->with('student.user')
            ->orderByDesc('created_at')
            ->get();

        // Demandes traitées
        $processedRequests = RecommendationRequest::where('professor_id', $professor->id)
            ->whereIn('status', ['accepted', 'rejected'])
            ->with('student.user')
            ->orderByDesc('responded_at')
            ->get();

        Log::info('📋 Affichage recommendations', [
            'professor_id' => $professor->id,
            'pending' => $pendingRequests->count(),
            'processed' => $processedRequests->count(),
        ]);

        return inertia('Professor/Recommendations', [
            'pendingRequests' => $pendingRequests,
            'processedRequests' => $processedRequests,
        ]);
    }

    /**
     * Accepter une demande et générer la lettre
     */
    public function accept(RecommendationRequest $request)
    {
        $user = auth()->user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor) {
            return redirect()->back()->withErrors(['error' => 'Profil professeur non trouvé.']);
        }

        if ((int)$request->professor_id !== (int)$professor->id) {
            return redirect()->back()->withErrors(['error' => 'Cette demande ne vous appartient pas.']);
        }

        if ($request->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Demande déjà traitée.']);
        }

        try {
            Log::info('🎯 Génération de lettre', ['request_id' => $request->id]);

            // Générer la lettre PDF
            $this->letterService->generateLetter($request);

            // Marquer comme acceptée
            $request->update([
                'status' => 'accepted',
                'responded_at' => now(),
            ]);

            Log::info('✅ Lettre générée avec succès');

            return redirect()->back()->with('success', '✅ Lettre générée avec succès !');

        } catch (\Exception $e) {
            Log::error('❌ Erreur génération lettre', [
                'error' => $e->getMessage(),
                'request_id' => $request->id,
            ]);
            return redirect()->back()->withErrors(['error' => 'Erreur : ' . $e->getMessage()]);
        }
    }

    /**
     * Refuser une demande
     */
    public function reject(RecommendationRequest $request, Request $httpRequest)
    {
        $user = auth()->user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor) {
            return redirect()->back()->withErrors(['error' => 'Profil professeur non trouvé.']);
        }

        if ((int)$request->professor_id !== (int)$professor->id) {
            return redirect()->back()->withErrors(['error' => 'Cette demande ne vous appartient pas.']);
        }

        if ($request->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Demande déjà traitée.']);
        }

        // Valider la raison
        $data = $httpRequest->validate([
            'rejection_reason' => 'required|string|min:5|max:500',
        ]);

        try {
            $request->update([
                'status' => 'rejected',
                'rejection_reason' => $data['rejection_reason'],
                'responded_at' => now(),
            ]);

            Log::info('🚫 Demande refusée', ['request_id' => $request->id]);

            return redirect()->back()->with('success', '❌ Demande refusée.');

        } catch (\Exception $e) {
            Log::error('❌ Erreur refus', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Erreur : ' . $e->getMessage()]);
        }
    }

    /**
     * Télécharger la lettre PDF
     */
    public function downloadLetter(RecommendationRequest $request)
    {
        $user = auth()->user();
        $professor = Professor::where('user_id', $user->id)->first();

        if (!$professor) {
            abort(403, 'Profil professeur non trouvé.');
        }

        if ((int)$request->professor_id !== (int)$professor->id) {
            abort(403, 'Non autorisé.');
        }

        if (!$request->letter) {
            abort(404, 'Lettre non trouvée.');
        }

        $path = storage_path('app/' . $request->letter->file_path);

        if (!file_exists($path)) {
            abort(404, 'Fichier non trouvé.');
        }

        return response()->download($path, 'lettre_recommandation.pdf');
    }
}