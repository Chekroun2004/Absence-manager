<?php

namespace App\Http\Controllers\Api;

use App\Models\RecommendationRequest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Carbon\Carbon;

class RecommendationRequestController extends Controller
{
    // Étudiant : soumettre une demande
    public function store(Request $request)
    {
        $validated = $request->validate([
            'professor_id' => 'required|exists:professors,id',
        ]);

        $student = Student::where('user_id', auth()->id())->firstOrFail();

        // Vérifier si déjà soumise
        $existing = RecommendationRequest::where('student_id', $student->id)
            ->where('professor_id', $validated['professor_id'])
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json([
                'error' => 'Une demande est déjà en attente pour ce professeur'
            ], 400);
        }

        $request_obj = RecommendationRequest::create([
            'student_id' => $student->id,
            'professor_id' => $validated['professor_id'],
            'status' => 'pending',
        ]);

        return response()->json($request_obj, 201);
    }

    // Professeur : récupérer les demandes en attente
    public function pendingRequests()
    {
        $professor = auth()->user()->professor;

        if (!$professor) {
            return response()->json(['error' => 'Professeur non trouvé'], 404);
        }

        $requests = RecommendationRequest::where('professor_id', $professor->id)
            ->where('status', 'pending')
            ->with('student.user')
            ->latest()
            ->get();

        return response()->json($requests);
    }

    // Professeur : accepter une demande
    public function accept(Request $request, $id)
    {
        $rec_request = RecommendationRequest::findOrFail($id);

        // Vérifier que c'est le bon professeur
        if ($rec_request->professor_id !== auth()->user()->professor->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $rec_request->update([
            'status' => 'accepted',
            'responded_at' => Carbon::now(),
        ]);

        return response()->json($rec_request);
    }

    // Professeur : refuser une demande
    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|min:10',
        ]);

        $rec_request = RecommendationRequest::findOrFail($id);

        if ($rec_request->professor_id !== auth()->user()->professor->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $rec_request->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'responded_at' => Carbon::now(),
        ]);

        return response()->json($rec_request);
    }

    // Étudiant : récupérer ses demandes
    public function studentRequests()
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();

        $requests = RecommendationRequest::where('student_id', $student->id)
            ->with('professor.user')
            ->latest()
            ->get();

        return response()->json($requests);
    }
}