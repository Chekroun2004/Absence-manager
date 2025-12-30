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
    Schema::create('modules', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->foreignId('school_class_id')->constrained('school_classes')->onDelete('cascade');
        $table->foreignId('professor_id')->constrained('professors')->onDelete('cascade');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
