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
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            
            // Foreign key to link to the auth 'users' table [cite: 69]
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone_number')->nullable();
            
            // This 'type' field is crucial for your unified directory [cite: 31, 68]
            $table->enum('type', ['student', 'staff', 'both'])->default('student');
            
            $table->string('primary_role')->nullable(); // e.g., 'Student', 'Faculty', 'HR Manager' [cite: 68]
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();
            
            // For emergency contacts, documents, etc. [cite: 32]
            $table->json('contact_details')->nullable(); // Store emergency contacts
            $table->json('documents')->nullable(); // Store paths to ID scans, contracts [cite: 32]

            $table->timestamps();
            $table->softDeletes(); // Good for auditing and history
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};