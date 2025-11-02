<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_profile_id')->constrained('student_profiles')->onDelete('cascade');
            $table->foreignId('section_id')->constrained('sections')->onDelete('cascade');
            
            // The faculty user who marked the attendance
            $table->foreignId('marked_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->date('date');
            
            // As per your doc: "Student absence tracking (excused/unexcused)"
            $table->enum('status', ['present', 'absent', 'late', 'excused']);
            
            $table->text('notes')->nullable(); // e.g., "Left 30 mins early"
            $table->timestamps();

            // A student can only have one record per section per day
            $table->unique(['student_profile_id', 'section_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};