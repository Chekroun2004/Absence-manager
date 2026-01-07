<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum('role', ['admin', 'professor', 'student'])
                  ->default('student');
            $table->boolean('is_approved')->default(false);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')
                  ->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration');
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration');
        });

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('academic_mention', ['Très Bien', 'Bien', 
                  'Assez Bien', 'Passable']);
            $table->timestamps();
        });

        Schema::create('professors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->timestamps();
        });

        Schema::create('school_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('speciality');
            $table->string('academic_year');
            $table->timestamps();
        });

        Schema::create('student_school_class', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()
                  ->onDelete('cascade');
            $table->foreignId('school_class_id')
                  ->constrained('school_classes')->onDelete('cascade');
            $table->unique(['student_id', 'school_class_id']);
            $table->timestamps();
        });

        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('school_class_id')
                  ->constrained('school_classes')->onDelete('cascade');
            $table->foreignId('professor_id')
                  ->constrained('professors')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('module_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')
                  ->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')
                  ->onDelete('cascade');
            $table->unique(['module_id', 'student_id']);
            $table->timestamps();
        });

        Schema::create('class_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')
                  ->onDelete('cascade');
            $table->foreignId('professor_id')->constrained('professors')
                  ->onDelete('cascade');
            $table->string('code')->unique();
            $table->dateTime('started_at');
            $table->dateTime('expires_at');
            $table->enum('status', ['active', 'closed'])->default('active');
            $table->timestamps();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')
                  ->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')
                  ->onDelete('cascade');
            $table->foreignId('class_session_id')->nullable()
                  ->constrained('class_sessions')->onDelete('cascade');
            $table->date('date');
            $table->enum('status', ['present', 'absent', 'late'])
                  ->default('absent');
            $table->text('notes')->nullable();
            $table->timestamp('marked_at')->nullable();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')
                  ->onDelete('cascade');
            $table->foreignId('class_session_id')
                  ->constrained('class_sessions')->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->boolean('read')->default(false);
            $table->timestamps();
        });

        Schema::create('recommendation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')
                  ->onDelete('cascade');
            $table->foreignId('professor_id')->constrained('professors')
                  ->onDelete('cascade');
            $table->string('mention')->default('Bien'); // ✅ COLONNE AJOUTÉE
            $table->enum('status', ['pending', 'accepted', 'rejected'])
                  ->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });

        Schema::create('recommendation_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recommendation_request_id')->constrained()
                  ->onDelete('cascade');
            $table->string('file_path');
            $table->enum('mention_used', ['Très Bien', 'Bien', 
                  'Assez Bien', 'Passable']);
            $table->timestamp('generated_at');
            $table->timestamps();
        });

        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendations');
        Schema::dropIfExists('recommendation_letters');
        Schema::dropIfExists('recommendation_requests');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('class_sessions');
        Schema::dropIfExists('module_student');
        Schema::dropIfExists('modules');
        Schema::dropIfExists('student_school_class');
        Schema::dropIfExists('school_classes');
        Schema::dropIfExists('professors');
        Schema::dropIfExists('students');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};