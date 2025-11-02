<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            
            // Each team must belong to a department
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            
            // Links to the EmployeeProfile of the team leader
            $table->foreignId('team_lead_id')->nullable()->constrained('employee_profiles')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};