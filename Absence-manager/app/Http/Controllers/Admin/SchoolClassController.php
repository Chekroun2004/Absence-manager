<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index()
    {
        $schoolClasses = SchoolClass::with('modules')->get();

        return inertia('Admin/SchoolClassManagement', [
            'schoolClasses' => $schoolClasses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:school_classes,name',
            'speciality' => 'required|string',  // ✅ AJOUTÉ
            'academic_year' => 'required|string',  // ✅ AJOUTÉ
        ]);

        SchoolClass::create($validated);

        return redirect()->back()->with('success', 'Classe créée avec succès');
    }

    public function update(Request $request, SchoolClass $schoolClass)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:school_classes,name,' . $schoolClass->id,
            'speciality' => 'required|string',  // ✅ AJOUTÉ
            'academic_year' => 'required|string',  // ✅ AJOUTÉ
        ]);

        $schoolClass->update($validated);

        return redirect()->back()->with('success', 'Classe modifiée avec succès');
    }

    public function destroy(SchoolClass $schoolClass)
    {
        $schoolClass->delete();

        return redirect()->back()->with('success', 'Classe supprimée avec succès');
    }
}