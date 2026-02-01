<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ClassSession;
use App\Models\Attendance;
use App\Models\AbsenceJustification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AbsenceJustificationController extends Controller
{
    // ✅ SOUMETTRE UNE JUSTIFICATION
   public function store(ClassSession $session, Request $request)
{
    try {
        \Log::info('🎯 Tentative justification', ['session_id' => $session->id]);

        $student = auth()->user()->student;

        if (!$student) {
            \Log::error('❌ Student non trouvé');
            return redirect()->back()->with('error', '❌ Profil étudiant non trouvé');
        }

        \Log::info('✅ Student trouvé', ['student_id' => $student->id]);

        // Trouver l'attendance
        $attendance = Attendance::where('student_id', $student->id)
            ->where('class_session_id', $session->id)
            ->first();

        \Log::info('🔍 Recherche attendance', [
            'student_id' => $student->id,
            'session_id' => $session->id,
            'found' => $attendance ? 'OUI' : 'NON'
        ]);

        if (!$attendance) {
            \Log::error('❌ Attendance non trouvée');
            return redirect()->back()->with('error', '❌ Aucune absence enregistrée');
        }

        if ($attendance->status === 'present') {
            \Log::error('❌ Étudiant marqué présent');
            return redirect()->back()->with('error', '❌ Vous êtes marqué présent!');
        }

        // Valider
        $validated = $request->validate([
            'reason' => 'required|string|min:10',
            'document' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('justifications', 'local');
        }

        // Créer
        $justification = AbsenceJustification::create([
            'student_id' => $student->id,
            'attendance_id' => $attendance->id,
            'reason' => $validated['reason'],
            'document_path' => $documentPath,
            'status' => 'pending',
        ]);

        \Log::info('✅ Justification créée', ['justification_id' => $justification->id]);

        return redirect()->back()->with('success', '✅ Justification soumise!');

    } catch (\Exception $e) {
        \Log::error('❌ Erreur justification', [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        return redirect()->back()->with('error', 'Erreur: ' . $e->getMessage());
    }
}

    // ✅ TÉLÉCHARGER LE DOCUMENT
    public function downloadFile(AbsenceJustification $justification)
    {
        $student = auth()->user()->student;

        if ($justification->student_id !== $student->id) {
            abort(403, 'Non autorisé');
        }

        if (!$justification->document_path) {
            return redirect()->back()->with('error', 'Aucun document');
        }

        return Storage::disk('local')->download($justification->document_path);
    }
}