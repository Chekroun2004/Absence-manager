<?php

namespace App\Http\Controllers\Api;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use Carbon\Carbon;

class LessonController extends Controller
{
    // Créer une nouvelle leçon
    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:modules,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $lesson = Lesson::create([
            'module_id' => $validated['module_id'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'dynamic_code' => Str::random(6),
            'code_expires_at' => Carbon::now()->addHours(2),
            'status' => 'pending',
        ]);

        return response()->json($lesson, 201);
    }

    // Démarrer une leçon (générer le code)
    public function activate($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->update([
            'status' => 'active',
            'code_expires_at' => Carbon::now()->addHours(2),
        ]);

        return response()->json($lesson);
    }

    // Clôturer une leçon
    public function close($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->update(['status' => 'closed']);

        return response()->json($lesson);
    }

    // Récupérer une leçon avec le code
    public function show($id)
    {
        $lesson = Lesson::with('module.schoolClass', 'attendances')->findOrFail($id);

        return response()->json($lesson);
    }

    // Récupérer les leçons d'un module
    public function byModule($moduleId)
    {
        $lessons = Lesson::where('module_id', $moduleId)
            ->with('attendances')
            ->latest()
            ->get();

        return response()->json($lessons);
    }
}