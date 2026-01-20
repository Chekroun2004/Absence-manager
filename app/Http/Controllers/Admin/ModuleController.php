<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleStudentGrade;
use App\Models\Professor;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = Module::with('professor.user', 'schoolClass', 'students')->get();
        $professors = Professor::with('user')->get();
        $schoolClasses = SchoolClass::all();

        return inertia('Admin/ModuleManagement', [
            'modules' => $modules,
            'professors' => $professors,
            'schoolClasses' => $schoolClasses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'school_class_id' => 'required|exists:school_classes,id',
            'professor_id' => 'required|exists:professors,id',
        ]);

        Module::create($validated);

        return redirect()->back()->with('success', 'Module créé');
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'school_class_id' => 'required|exists:school_classes,id',
            'professor_id' => 'required|exists:professors,id',
        ]);

        $module->update($validated);

        return redirect()->back()->with('success', 'Module modifié');
    }

    public function destroy(Module $module)
    {
        $module->delete();

        return redirect()->back()->with('success', 'Module supprimé');
    }

    public function showAssignForm(Module $module)
    {
        $approvedStudentUsers = User::where('role', 'student')
            ->where('is_approved', 1)
            ->get();
        
        $students = $approvedStudentUsers->map(function($user) {
            $student = Student::firstOrCreate(
                ['user_id' => $user->id]
            );
            $student->load('user');
            return $student;
        });
        
        return inertia('Admin/AssignStudents', [
            'module' => $module,
            'students' => $students,
        ]);
    }

    public function assignStudents(Request $request, Module $module)
    {
        $validated = $request->validate([
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        // ✅ Synchroniser la relation pivot module_student
        $module->students()->sync($validated['student_ids'] ?? []);

        // ✅ CRÉER LES MODULESSTUDENTGRADES MANQUANTS
        $studentIds = $validated['student_ids'] ?? [];
        $mentions = ['Très Bien', 'Bien', 'Assez Bien', 'Passable'];
        
        foreach ($studentIds as $studentId) {
            // Vérifier si la mention existe déjà
            $gradeExists = ModuleStudentGrade::where('student_id', $studentId)
                ->where('module_id', $module->id)
                ->exists();
            
            // Si n'existe pas, la créer avec mention par défaut
            if (!$gradeExists) {
                ModuleStudentGrade::create([
                    'student_id' => $studentId,
                    'module_id' => $module->id,
                    'mention' => 'Passable', // Mention par défaut
                ]);
            }
        }

        return redirect('/admin/modules')->with('success', '✅ Étudiants assignés et mentions créées avec succès!');
    }

    // ========== GESTION MENTIONS ==========
    public function gradesIndex()
    {
        $schoolClasses = SchoolClass::with('modules')->get();
        
        return Inertia::render('Admin/StudentGrades', [
            'schoolClasses' => $schoolClasses,
        ]);
    }

    public function gradesModule(Module $module)
    {
        $students = $module->students()
            ->with(['moduleGrades' => function ($query) use ($module) {
                $query->where('module_id', $module->id);
            }, 'user'])
            ->get();

        // ✅ DEBUG : Affiche ce qu'on reçoit
        \Log::info('Students data:', $students->toArray());

        $mappedStudents = $students->map(function($student) use ($module) {
            $grade = $student->moduleGrades->first();
            return [
                'id' => $student->id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'gradeId' => $grade?->id,  // ✅ Vérifie que c'est bien retourné
                'mention' => $grade?->mention ?? 'Passable',
            ];
        });

        return Inertia::render('Admin/StudentGradesEdit', [
            'module' => [
                'id' => $module->id,
                'name' => $module->name,
                'class' => $module->schoolClass->name,
            ],
            'students' => $mappedStudents,
        ]);
    }

    public function updateGrade(ModuleStudentGrade $moduleStudentGrade, Request $request)
    {
        $validated = $request->validate([
            'mention' => 'required|string|in:Très Bien,Bien,Assez Bien,Passable',
        ]);

        try {
            $moduleStudentGrade->update(['mention' => $validated['mention']]);
            
            return redirect()->back()->with('success', '✅ Mention mise à jour avec succès !');
        } catch (\Exception $e) {
            \Log::error('Erreur mise à jour mention:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Erreur lors de la mise à jour']);
        }
    }
}