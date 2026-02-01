<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Student;
use App\Models\ModuleStudentGrade;
use Illuminate\Database\Seeder;

class ModuleStudentGradeSeeder extends Seeder
{
    public function run(): void
    {
        $mentions = ['Très Bien', 'Bien', 'Assez Bien', 'Passable'];
        
        $modules = Module::all();
        $students = Student::all();

        foreach ($students as $student) {
            foreach ($modules as $module) {
                ModuleStudentGrade::create([
                    'student_id' => $student->id,
                    'module_id' => $module->id,
                    'mention' => $mentions[array_rand($mentions)],
                ]);
            }
        }
    }
}