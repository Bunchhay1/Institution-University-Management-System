<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            // Drop the old string placeholder
            $table->dropColumn('program_id');
            
            // Add the new foreign key
            $table->foreignId('program_id')->nullable()->after('enrollment_no')->constrained('programs')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropForeign(['program_id']);
            $table->dropColumn('program_id');
            
            // Add back the old string placeholder
            $table->string('program_id')->nullable();
        });
    }
};