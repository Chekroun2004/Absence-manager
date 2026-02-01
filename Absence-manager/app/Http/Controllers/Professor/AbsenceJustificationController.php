<?php

namespace App\Http\Controllers\Professor;

use App\Http\Controllers\Controller;
use App\Models\AbsenceJustification;
use App\Models\Professor;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AbsenceJustificationController extends Controller
{
    // ========== LISTE JUSTIFICATIONS ==========
    public function index()
    {
        $user = auth()->user();
        $professor = $user->professor;

        if (!$professor) {
            abort(403, 'Professeur non trouvé');
        }

        // ✅ RÉCUPÉRER LES JUSTIFICATIONS DU PROFESSEUR
        $justifications = AbsenceJustification::whereHas(
            'attendance',
            function ($query) use ($professor) {
                $query->whereHas('classSession', function ($q) use ($professor) {
                    $q->where('professor_id', $professor->id);
                });
            }
        )
            ->with([
                'student.user',
                'attendance.classSession.module',
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($j) {
                return [
                    'id' => $j->id,
                    'student_id' => $j->student->id,
                    'student_name' => $j->student->user->name,
                    'student_email' => $j->student->user->email,
                    'module_name' => $j->attendance->classSession->module->name,
                    'reason' => $j->reason,
                    'document_path' => $j->document_path,
                    'status' => $j->status,
                    'rejection_reason' => $j->rejection_reason,
                    'created_at' => $j->created_at->format('d/m/Y H:i'),
                    'session_date' => $j->attendance->classSession->started_at
                        ->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('Professor/AbsenceJustifications', [
            'justifications' => $justifications,
        ]);
    }

    // ========== APPROUVER JUSTIFICATION ==========
    public function approve(AbsenceJustification $justification)
    {
        $professor = auth()->user()->professor;

        if (!$professor) {
            abort(403, 'Professeur non trouvé');
        }

        // ✅ COMPARAISON DIRECTE AU LIEU DE where()->exists()
        if ($justification->attendance->classSession->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        if ($justification->status !== 'pending') {
            return redirect()->back()->with(
                'error',
                '❌ Justification déjà traitée.'
            );
        }

        $justification->update([
            'status' => 'approved',
            'rejection_reason' => null,
        ]);

        return redirect()->back()->with('success', '✅ Justification approuvée!');
    }

    // ========== REJETER JUSTIFICATION ==========
    public function reject(AbsenceJustification $justification, Request $request)
    {
        $professor = auth()->user()->professor;

        if (!$professor) {
            abort(403, 'Professeur non trouvé');
        }

        // ✅ COMPARAISON DIRECTE
        if ($justification->attendance->classSession->professor_id !== $professor->id) {
            abort(403, 'Non autorisé.');
        }

        if ($justification->status !== 'pending') {
            return redirect()->back()->with(
                'error',
                '❌ Justification déjà traitée.'
            );
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|min:10|max:500',
        ]);

        $justification->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return redirect()->back()->with('success', '✅ Justification rejetée.');
    }

    // ========== VISUALISER DOCUMENT PDF ==========
    public function viewFile(AbsenceJustification $justification)
    {
        $professor = auth()->user()->professor;

        if (!$professor) {
            abort(403, 'Professeur non trouvé');
        }

        // ✅ COMPARAISON DIRECTE
        if ($justification->attendance->classSession->professor_id !== $professor->id) {
            abort(403, 'Non autorisé');
        }

        if (!$justification->document_path) {
            abort(404, 'Aucun document');
        }

        // ✅ UTILISER 'local' AU LIEU DE 'private'
        return Storage::disk('local')->response($justification->document_path);
    }

    // ========== TÉLÉCHARGER DOCUMENT ==========
    public function downloadFile(AbsenceJustification $justification)
    {
        $professor = auth()->user()->professor;

        if (!$professor) {
            abort(403, 'Professeur non trouvé');
        }

        // ✅ COMPARAISON DIRECTE
        if ($justification->attendance->classSession->professor_id !== $professor->id) {
            abort(403, 'Non autorisé');
        }

        if (!$justification->document_path) {
            return redirect()->back()->with('error', 'Aucun document');
        }

        // ✅ UTILISER 'local' AU LIEU DE 'private'
        return Storage::disk('local')->download($justification->document_path);
    }
}