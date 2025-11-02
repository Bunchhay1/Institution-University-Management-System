<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            
            // The faculty/lecturer teaching this section
            $table->foreignId('faculty_id')->nullable()->constrained('employee_profiles')->onDelete('set null');
            
            $table->string('term'); // e.g., "Fall 2025", "Spring 2026"
            $table->integer('capacity')->default(50);
            
            // Stores timetable info (e.g., ["Monday 10:00-12:00", "Wednesday 10:00-12:00"])
            $table->json('schedule')->nullable(); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};