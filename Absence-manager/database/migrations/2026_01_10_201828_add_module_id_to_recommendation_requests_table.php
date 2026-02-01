<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('recommendation_requests', function (Blueprint $table) {
            $table->foreignId('module_id')
                ->nullable()
                ->constrained('modules')
                ->onDelete('set null')
                ->after('professor_id');
        });
    }

    public function down(): void
    {
        Schema::table('recommendation_requests', function (Blueprint $table) {
            $table->dropForeignIdFor('Module::class');
        });
    }
};