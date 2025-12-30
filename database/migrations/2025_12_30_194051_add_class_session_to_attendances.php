<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->foreignId('class_session_id')
                ->nullable()
                ->after('module_id')
                ->constrained('class_sessions')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeignIdFor('ClassSession');
            $table->dropColumn('class_session_id');
        });
    }
};