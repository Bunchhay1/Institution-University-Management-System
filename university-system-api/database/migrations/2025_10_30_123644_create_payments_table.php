<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            // A payment is applied to an invoice
            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade');
            // A payment is made by a student
            $table->foreignId('student_profile_id')->constrained('student_profiles')->onDelete('cascade');
            
            $table->decimal('amount_paid', 10, 2);
            $table->date('payment_date');
            $table->string('payment_method')->nullable(); // e.g., "Credit Card", "Bank Transfer"
            $table->string('transaction_id')->nullable()->unique(); // From payment gateway
            
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};