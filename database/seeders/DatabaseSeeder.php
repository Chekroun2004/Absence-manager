<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Professor;
use App\Models\SchoolClass;
use App\Models\Module;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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
            'is_approved' => true,  // ✅ AJOUT — Change à false pour tester workflow
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
            'is_approved' => true,  // ✅ AJOUT
        ]);

        $professor2 = Professor::create([
            'user_id' => $prof2User->id,
            'title' => 'Prof.',
        ]);

        // Modules
        Module::create([
            'name' => 'Machine Learning',
            'school_class_id' => $class1->id,
            'professor_id' => $professor1->id,
        ]);
    
        
        Module::create([
            'name' => 'Big Data',
            'school_class_id' => $class1->id,
            'professor_id' => $professor2->id,
        ]);

        // Étudiants (approuvés pour tester, ou false pour attendre approval)
        for ($i = 1; $i <= 5; $i++) {
            $studentUser = User::create([
                'name' => "Étudiant $i",
                'email' => "student$i@example.com",
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_approved' => true,  // ✅ AJOUT — Change à false pour tester workflow
            ]);

            $student = Student::create([
                'user_id' => $studentUser->id,
                'apogee_code' => 'APO' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'academic_mention' => ['Très Bien', 'Bien', 'Assez Bien', 'Passable'][rand(0, 3)],
            ]);

            $student->schoolClasses()->attach($class1->id);
        }
    }
}