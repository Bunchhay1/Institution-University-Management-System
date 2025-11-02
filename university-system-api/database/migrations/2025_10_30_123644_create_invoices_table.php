<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            // An invoice is billed to a student
            $table->foreignId('student_profile_id')->constrained('student_profiles')->onDelete('cascade');
            
            $table->string('invoice_number')->unique();
            $table->date('issue_date');
            $table->date('due_date');
            
            // These amounts are calculated from the invoice_items
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total_paid', 10, 2)->default(0.00);
            $table->decimal('total_due', 10, 2);
            
            $table->enum('status', ['draft', 'due', 'paid', 'overdue', 'void'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};