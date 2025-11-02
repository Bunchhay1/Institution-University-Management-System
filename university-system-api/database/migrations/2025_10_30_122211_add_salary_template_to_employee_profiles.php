<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_profiles', function (Blueprint $table) {
            // This adds the proper foreign key
            $table->foreignId('salary_template_id')->nullable()->after('team_id')->constrained('salary_templates')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('employee_profiles', function (Blueprint $table) {
            $table->dropForeign(['salary_template_id']);
            $table->dropColumn('salary_template_id');
        });
    }
};