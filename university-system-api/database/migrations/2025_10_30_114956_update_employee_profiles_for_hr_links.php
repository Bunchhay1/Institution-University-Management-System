<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employee_profiles', function (Blueprint $table) {
            
            // **THIS IS THE FIX:**
            // We must first drop the old string-based placeholder columns
            // that we created in the 'create_employee_profiles_table' migration.
            // We also drop 'salary_template_id' as it will be replaced by the Payroll module.
            $table->dropColumn(['department_id', 'position_id', 'salary_template_id']);

            // Now we can add the new, proper foreign key columns
            $table->foreignId('department_id')->nullable()->after('employee_no')->constrained('departments')->onDelete('set null');
            $table->foreignId('position_id')->nullable()->after('department_id')->constrained('positions')->onDelete('set null');
            $table->foreignId('team_id')->nullable()->after('position_id')->constrained('teams')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employee_profiles', function (Blueprint $table) {
            
            // Drop the new foreign key columns
            $table->dropForeign(['department_id']);
            $table->dropForeign(['position_id']);
            $table->dropForeign(['team_id']);
            $table->dropColumn(['department_id', 'position_id', 'team_id']);

            // Add back the old string placeholders
            $table->string('department_id')->nullable();
            $table->string('position_id')->nullable();
            $table->string('salary_template_id')->nullable();
        });
    }
};