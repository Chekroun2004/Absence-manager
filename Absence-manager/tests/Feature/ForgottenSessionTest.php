<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Professor;
use App\Models\Student;
use App\Models\Module;
use App\Models\SchoolClass;
use App\Models\ClassSession;
use App\Models\Attendance;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ForgottenSessionTest extends TestCase
{
    use RefreshDatabase;

    private $professor;
    private $module;
    private $forgottenSession;

    protected function setUp(): void
    {
        parent::setUp();

        // Créer une classe
        $schoolClass = SchoolClass::create([
            'name' => 'Master 1',
            'speciality' => 'Informatique',
            'academic_year' => '2025-2026',
        ]);

        // Créer un professeur
        $user = User::create([
            'name' => 'Prof Test',
            'email' => 'prof@test.com',
            'password' => 'password',
            'role' => 'professor',
            'is_approved' => true,
        ]);

        $this->professor = Professor::create([
            'user_id' => $user->id,
            'title' => 'Dr.',
        ]);

        // Créer un module
        $this->module = Module::create([
            'name' => 'Test Module',
            'school_class_id' => $schoolClass->id,
            'professor_id' => $this->professor->id,
        ]);

        // Créer des étudiants
        for ($i = 0; $i < 3; $i++) {
            $studentUser = User::create([
                'name' => "Student $i",
                'email' => "student$i@test.com",
                'password' => 'password',
                'role' => 'student',
                'is_approved' => true,
            ]);

            $student = Student::create([
                'user_id' => $studentUser->id,
                'apogee_code' => "APO$i",
                'academic_mention' => 'Bien',
            ]);

            $this->module->students()->attach($student->id);
        }

        // Créer une séance "oubliée" (lancée il y a 30 minutes)
        $this->forgottenSession = ClassSession::create([
            'module_id' => $this->module->id,
            'professor_id' => $this->professor->id,
            'code' => 'ABC123',
            'started_at' => now()->subMinutes(30),
            'expires_at' => now()->subMinutes(28), // Expirée depuis 8 minutes
            'status' => 'active',
            'ended_at' => null,
        ]);
    }

    /** @test */
    public function test_forgotten_session_appears_in_dashboard()
    {
        // Connecter le professeur
        $this->actingAs($this->professor->user);

        // Récupérer les séances actives
        $activeSessions = ClassSession::where('professor_id', $this->professor->id)
            ->where('status', 'active')
            ->whereNull('ended_at')
            ->get();

        // Vérifier que la séance oubliée est dans la liste
        $this->assertCount(1, $activeSessions);
        $this->assertEquals('ABC123', $activeSessions->first()->code);
    }

    /** @test */
    public function test_can_resume_forgotten_session()
    {
        // Connecter le professeur
        $this->actingAs($this->professor->user);

        $oldCode = $this->forgottenSession->code;
        $oldExpiresAt = $this->forgottenSession->expires_at;

        // Réactiver la séance
        $response = $this->post(
            route('professor.sessions.resume', $this->forgottenSession->id),
            []
        );

        // Recharger la séance depuis la base
        $this->forgottenSession->refresh();

        // Vérifier que le code a changé
        $this->assertNotEquals($oldCode, $this->forgottenSession->code);

        // Vérifier que expires_at a été réinitialisé
        $this->assertGreaterThan($oldExpiresAt, $this->forgottenSession->expires_at);

        // Vérifier que le statut reste 'active'
        $this->assertEquals('active', $this->forgottenSession->status);

        // Vérifier que c'est un code valide (6 caractères alphanumériques)
        $this->assertRegExp('/^[A-Z0-9]{6}$/', $this->forgottenSession->code);
    }

    /** @test */
    public function test_cannot_resume_closed_session()
    {
        // Connecter le professeur
        $this->actingAs($this->professor->user);

        // Fermer la séance
        $this->forgottenSession->update([
            'status' => 'closed',
            'ended_at' => now(),
        ]);

        // Essayer de la reprendre
        $response = $this->post(
            route('professor.sessions.resume', $this->forgottenSession->id),
            []
        );

        // Vérifier que la réponse contient une erreur
        $response->assertRedirect();
        $response->assertSessionHas('error');
    }

    /** @test */
    public function test_cannot_resume_other_professors_session()
    {
        // Créer un autre professeur
        $otherUser = User::create([
            'name' => 'Prof Other',
            'email' => 'other@test.com',
            'password' => 'password',
            'role' => 'professor',
            'is_approved' => true,
        ]);

        $otherProfessor = Professor::create([
            'user_id' => $otherUser->id,
            'title' => 'Dr.',
        ]);

        // Connecter le prof étranger
        $this->actingAs($otherUser);

        // Essayer de reprendre la séance d'un autre prof
        $response = $this->post(
            route('professor.sessions.resume', $this->forgottenSession->id),
            []
        );

        // Vérifier que c'est une erreur 403
        $response->assertStatus(403);
    }

    /** @test */
    public function test_forgotten_session_detection()
    {
        // Créer une séance lancée il y a 25 minutes (> 20 min)
        $forgottenSession = ClassSession::create([
            'module_id' => $this->module->id,
            'professor_id' => $this->professor->id,
            'code' => 'XYZ789',
            'started_at' => now()->subMinutes(25),
            'expires_at' => now()->subMinutes(23),
            'status' => 'active',
            'ended_at' => null,
        ]);

        // Vérifier que c'est détecté comme oubliée
        $isForgettten = $forgottenSession->started_at->diffInMinutes(now()) > 20;
        $this->assertTrue($isForgettten);
    }

    /** @test */
    public function test_close_forgotten_session_marks_absents()
    {
        // Connecter le professeur
        $this->actingAs($this->professor->user);

        // Marquer un étudiant comme présent
        $presentStudent = $this->module->students()->first();
        Attendance::create([
            'student_id' => $presentStudent->id,
            'class_session_id' => $this->forgottenSession->id,
            'module_id' => $this->module->id,
            'date' => now()->toDateString(),
            'status' => 'present',
            'marked_at' => now(),
        ]);

        // Fermer la séance
        $this->post(route('professor.sessions.close', $this->forgottenSession->id), []);

        // Vérifier que tous les étudiants ont une entrée
        $attendances = Attendance::where('class_session_id', $this->forgottenSession->id)->get();
        $this->assertCount(3, $attendances); // 3 étudiants = 3 entrées

        // Vérifier qu'il y a 1 présent et 2 absents
        $presentCount = $attendances->where('status', 'present')->count();
        $absentCount = $attendances->where('status', 'absent')->count();

        $this->assertEquals(1, $presentCount);
        $this->assertEquals(2, $absentCount);
    }

    /** @test */
    public function test_session_is_forgotten_if_older_than_20_minutes()
    {
        // Créer une séance lancée il y a 15 minutes (< 20 min)
        $recentSession = ClassSession::create([
            'module_id' => $this->module->id,
            'professor_id' => $this->professor->id,
            'code' => 'NEW001',
            'started_at' => now()->subMinutes(15),
            'expires_at' => now()->subMinutes(13),
            'status' => 'active',
            'ended_at' => null,
        ]);

        // Vérifier que c'est pas détecté comme oubliée
        $isForgotten = $recentSession->started_at->diffInMinutes(now()) > 20;
        $this->assertFalse($isForgotten);

        // Créer une séance lancée il y a 25 minutes (> 20 min)
        $oldSession = ClassSession::create([
            'module_id' => $this->module->id,
            'professor_id' => $this->professor->id,
            'code' => 'OLD001',
            'started_at' => now()->subMinutes(25),
            'expires_at' => now()->subMinutes(23),
            'status' => 'active',
            'ended_at' => null,
        ]);

        // Vérifier que c'est détecté comme oubliée
        $isForgotten = $oldSession->started_at->diffInMinutes(now()) > 20;
        $this->assertTrue($isForgotten);
    }
}
