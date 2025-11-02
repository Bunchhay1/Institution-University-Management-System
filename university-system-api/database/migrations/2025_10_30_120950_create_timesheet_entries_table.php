<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('timesheet_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_profile_id')->constrained('employee_profiles')->onDelete('cascade');
            
            // As per your doc: "student-workers submit hours per department/job"
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            
            $table->dateTime('clock_in');
            $table->dateTime('clock_out')->nullable();
            
            // Storing calculated hours is good for reporting
            $table->decimal('hours_worked', 8, 2)->nullable(); 
            
            $table->enum('status', ['submitted', 'approved', 'rejected'])->default('submitted');
            $table->foreignId('approved_by_id')->nullable()->constrained('employee_profiles')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timesheet_entries');
    }
};