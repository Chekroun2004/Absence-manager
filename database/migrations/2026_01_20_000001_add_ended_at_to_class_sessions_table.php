<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Vérifier si la colonne n'existe pas déjà
        if (!Schema::hasColumn('class_sessions', 'ended_at')) {
            Schema::table('class_sessions', function (Blueprint $table) {
                $table->dateTime('ended_at')->nullable()->after('expires_at');
            });
        }
    }

    public function down(): void
    {
        Schema::table('class_sessions', function (Blueprint $table) {
            $table->dropColumn('ended_at');
        });
    }
};
