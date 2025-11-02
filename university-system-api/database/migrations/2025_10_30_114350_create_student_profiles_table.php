<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            
            // This creates the one-to-one link to the 'people' table
            $table->foreignId('person_id')->unique()->constrained()->onDelete('cascade');
            
            $table->string('enrollment_no')->unique(); // Student ID number 
            $table->string('program_id')->nullable(); // Will link to 'programs' table later 
            $table->date('enrollment_date')->nullable();
            $table->string('status')->default('active'); // e.g., active, graduated, withdrawn
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};