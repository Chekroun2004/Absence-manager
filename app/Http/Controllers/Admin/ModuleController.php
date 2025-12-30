<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Professor;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;

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

    // ✅ NOUVELLE MÉTHODE : Afficher la page d'assignation
    public function showAssignForm(Module $module)
    {
        $students = Student::with('user')->get();
        
        return inertia('Admin/AssignStudents', [
            'module' => $module,
            'students' => $students,
        ]);
    }

    // ✅ ASSIGNATION
    public function assignStudents(Request $request, Module $module)
    {
       $validated = $request->validate([
        'student_ids' => 'nullable|array',
        'student_ids.*' => 'exists:students,id',
    ]);

    // ✅ Synchroniser la relation
    $module->students()->sync($validated['student_ids'] ?? []);

    return redirect('/admin/modules')->with('success', 'Étudiants assignés avec succès!');
    
    }
}