<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Professor;
use App\Models\SchoolClass;
use App\Models\Module;
use App\Models\ModuleStudentGrade;
use App\Models\ClassSession;
use App\Models\Attendance;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer les classes
        $class1 = SchoolClass::create([
            'name' => 'Master 1 - Data Science',
            'speciality' => 'Informatique',
            'academic_year' => '2024-2025',
        ]);

        $class2 = SchoolClass::create([
            'name' => 'Master 2 - Data Science',
            'speciality' => 'Informatique',
            'academic_year' => '2024-2025',
        ]);

        // Admin (approuvé)
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_approved' => true,
        ]);

        // Professeurs (approuvés pour tester, ou false pour attendre approval)
        $prof1User = User::create([
            'name' => 'Dr. Ahmed Hassan',
            'email' => 'ahmed@example.com',
            'password' => Hash::make('password'),
            'role' => 'professor',
            'is_approved' => true,
        ]);

        $professor1 = Professor::create([
            'user_id' => $prof1User->id,
            'title' => 'Dr.',
        ]);

        $prof2User = User::create([
            'name' => 'Prof. Fatima El Mansouri',
            'email' => 'fatima@example.com',
            'password' => Hash::make('password'),
            'role' => 'professor',
            'is_approved' => true,
        ]);

        $professor2 = Professor::create([
            'user_id' => $prof2User->id,
            'title' => 'Prof.',
        ]);

        // ✅ Créer les modules
        $module1 = Module::create([
            'name' => 'Machine Learning',
            'school_class_id' => $class1->id,
            'professor_id' => $professor1->id,
        ]);
    
        $module2 = Module::create([
            'name' => 'Big Data',
            'school_class_id' => $class1->id,
            'professor_id' => $professor2->id,
        ]);

        // ✅ Créer les étudiants
        $students = [];
        $mentions = ['Très Bien', 'Bien', 'Assez Bien', 'Passable'];
        
        for ($i = 1; $i <= 5; $i++) {
            $studentUser = User::create([
                'name' => "Étudiant $i",
                'email' => "student$i@example.com",
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_approved' => true,
            ]);

            $student = Student::create([
                'user_id' => $studentUser->id,
                'academic_mention' => $mentions[rand(0, 3)],
            ]);

            $student->schoolClasses()->attach($class1->id);
            $students[] = $student;
        }

        // ✅ CRÉER LES MENTIONS PAR ÉTUDIANT ET PAR MODULE
        foreach ($students as $student) {
            // Mention pour Machine Learning
            ModuleStudentGrade::create([
                'student_id' => $student->id,
                'module_id' => $module1->id,
                'mention' => $mentions[rand(0, 3)],
            ]);

            // Mention pour Big Data
            ModuleStudentGrade::create([
                'student_id' => $student->id,
                'module_id' => $module2->id,
                'mention' => $mentions[rand(0, 3)],
            ]);
        }

        // ✅ ATTACHER LES ÉTUDIANTS AUX MODULES
        foreach ($students as $student) {
            $student->modules()->attach([$module1->id, $module2->id]);
        }

        // ✅ CRÉER LES SÉANCES DE CLASSE
        $sessions = [];
        for ($i = 1; $i <= 3; $i++) {
            $sessions[] = ClassSession::create([
                'module_id' => $module1->id,
                'code' => 'CODE' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'professor_id' => $professor1->id,
                'started_at' => now()->subDays(10 - $i),
                'expires_at' => now()->subDays(10 - $i)->addHours(2),
                'status' => 'closed',
            ]);
            
            $sessions[] = ClassSession::create([
                'module_id' => $module2->id,
                'code' => 'CODE' . str_pad($i + 10, 3, '0', STR_PAD_LEFT),
                'professor_id' => $professor2->id,
                'started_at' => now()->subDays(9 - $i),
                'expires_at' => now()->subDays(9 - $i)->addHours(2),
                'status' => 'closed',
            ]);
        }

        // ✅ CRÉER LES ABSENCES (Pour les 2 premiers étudiants : 6+ absences)
        // Étudiant 1 : 6 absences
        for ($j = 0; $j < count($sessions); $j++) {
            Attendance::create([
                'student_id' => $students[0]->id,
                'class_session_id' => $sessions[$j]->id,
                'module_id' => $sessions[$j]->module_id,
                'date' => $sessions[$j]->started_at->toDateString(),
                'status' => 'absent',
                'marked_at' => $sessions[$j]->started_at,
            ]);
        }

        // Étudiant 2 : 4 absences
        for ($j = 0; $j < 4; $j++) {
            Attendance::create([
                'student_id' => $students[1]->id,
                'class_session_id' => $sessions[$j]->id,
                'module_id' => $sessions[$j]->module_id,
                'date' => $sessions[$j]->started_at->toDateString(),
                'status' => 'absent',
                'marked_at' => $sessions[$j]->started_at,
            ]);
        }

        // Étudiant 3 : 3 absences (seuil minimum)
        for ($j = 0; $j < 3; $j++) {
            Attendance::create([
                'student_id' => $students[2]->id,
                'class_session_id' => $sessions[$j]->id,
                'module_id' => $sessions[$j]->module_id,
                'date' => $sessions[$j]->started_at->toDateString(),
                'status' => 'absent',
                'marked_at' => $sessions[$j]->started_at,
            ]);
        }
    }
}