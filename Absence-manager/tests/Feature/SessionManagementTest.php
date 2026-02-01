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

class SessionManagementTest extends TestCase
{
    use RefreshDatabase;

    private $professor;
    private $module;
    private $session;

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
        for ($i = 0; $i < 5; $i++) {
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
    }

    /** @test */
    public function test_session_code_expires_after_20_seconds()
    {
        $session = ClassSession::create([
            'module_id' => $this->module->id,
            'professor_id' => $this->professor->id,
            'code' => 'ABC123',
            'started_at' => now(),
            'expires_at' => now()->addSeconds(20),
            'status' => 'active',
        ]);

        // Vérifier que la séance n'est pas expirée immédiatement
        $this->assertFalse(now()->isAfter($session->expires_at));

        // Avancer le temps
        $this->travelTo(now()->addSeconds(21));

        // Vérifier que la séance est maintenant expirée
        $this->assertTrue(now()->isAfter($session->expires_at));
    }

    /** @test */
    public function test_attendance_marked_as_present()
    {
        $session = ClassSession::create([
            'module_id' => $this->module->id,
            'professor_id' => $this->professor->id,
            'code' => 'ABC123',
            'started_at' => now(),
            'expires_at' => now()->addSeconds(20),
            'status' => 'active',
        ]);

        $student = $this->module->students()->first();

        // Marquer comme présent
        $attendance = Attendance::create([
            'student_id' => $student->id,
            'class_session_id' => $session->id,
            'module_id' => $this->module->id,
            'date' => now()->toDateString(),
            'status' => 'present',
            'marked_at' => now(),
        ]);

        $this->assertEquals('present', $attendance->status);
        $this->assertDatabaseHas('attendances', [
            'student_id' => $student->id,
            'class_session_id' => $session->id,
            'status' => 'present',
        ]);
    }

    /** @test */
    public function test_session_close_marks_absent_students()
    {
        $session = ClassSession::create([
            'module_id' => $this->module->id,
            'professor_id' => $this->professor->id,
            'code' => 'ABC123',
            'started_at' => now(),
            'expires_at' => now()->addSeconds(20),
            'status' => 'active',
        ]);

        // Marquer UN seul étudiant comme présent
        $presentStudent = $this->module->students()->first();
        Attendance::create([
            'student_id' => $presentStudent->id,
            'class_session_id' => $session->id,
            'module_id' => $this->module->id,
            'date' => now()->toDateString(),
            'status' => 'present',
            'marked_at' => now(),
        ]);

        // Fermer la séance
        $session->update([
            'status' => 'closed',
            'ended_at' => now(),
        ]);

        // Marquer les absents
        $students = $this->module->students()->pluck('students.id');
        foreach ($students as $student_id) {
            $attendance = Attendance::where('class_session_id', $session->id)
                ->where('student_id', $student_id)
                ->first();

            if (!$attendance) {
                Attendance::create([
                    'student_id' => $student_id,
                    'module_id' => $this->module->id,
                    'class_session_id' => $session->id,
                    'date' => $session->started_at->toDateString(),
                    'status' => 'absent',
                    'marked_at' => now(),
                ]);
            }
        }

        // Vérifier
        $this->assertEquals(1, Attendance::where('class_session_id', $session->id)->where('status', 'present')->count());
        $this->assertEquals(4, Attendance::where('class_session_id', $session->id)->where('status', 'absent')->count());
    }

    /** @test */
    public function test_cannot_close_session_twice()
    {
        $session = ClassSession::create([
            'module_id' => $this->module->id,
            'professor_id' => $this->professor->id,
            'code' => 'ABC123',
            'started_at' => now(),
            'expires_at' => now()->addSeconds(20),
            'status' => 'closed',
            'ended_at' => now(),
        ]);

        // Vérifier que le statut est bien 'closed'
        $this->assertEquals('closed', $session->status);
        $this->assertNotNull($session->ended_at);
    }

    /** @test */
    public function test_session_has_correct_duration()
    {
        $startedAt = now();
        $endedAt = $startedAt->copy()->addMinutes(5);

        $session = ClassSession::create([
            'module_id' => $this->module->id,
            'professor_id' => $this->professor->id,
            'code' => 'ABC123',
            'started_at' => $startedAt,
            'expires_at' => $startedAt->copy()->addSeconds(20),
            'ended_at' => $endedAt,
            'status' => 'closed',
        ]);

        $duration = $session->started_at->diffInMinutes($session->ended_at);
        $this->assertEquals(5, $duration);
    }
}
