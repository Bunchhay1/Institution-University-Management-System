<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_profile_id')->constrained('student_profiles')->onDelete('cascade');
            $table->foreignId('section_id')->constrained('sections')->onDelete('cascade');
            
            // Basic grade as per your MVP scope
            $table->string('grade', 5)->nullable(); // e.g., "A+", "B-", "85"
            
            $table->string('status')->default('enrolled'); // e.g., enrolled, withdrawn, completed
            
            // Ensures a student can only enroll in the same section once
            $table->unique(['student_profile_id', 'section_id']);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};