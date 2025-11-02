<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_profiles', function (Blueprint $table) {
            $table->id();
            
            // This creates the one-to-one link to the 'people' table
            $table->foreignId('person_id')->unique()->constrained()->onDelete('cascade');
            
            $table->string('employee_no')->unique(); // Employee ID number 
            $table->string('position_id')->nullable(); // Will link to 'positions' table later 
            $table->string('department_id')->nullable(); // Will link to 'departments' table later 
            $table->string('salary_template_id')->nullable(); // Will link to payroll 
            $table->date('join_date');
            
            // As per your 'HR' module requirements [cite: 40]
            $table->enum('contract_type', ['full-time', 'part-time', 'temporary', 'student-worker']);

            $table->string('manager_id')->nullable(); // Can link to another EmployeeProfile
            $table->string('status')->default('active'); // e.g., active, resigned, terminated

            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('employee_profiles');
    }
};