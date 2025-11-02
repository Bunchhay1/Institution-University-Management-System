<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $casts = ['issue_date' => 'date', 'due_date' => 'date'];

    // An invoice belongs to one student
    public function student(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class, 'student_profile_id');
    }

    // An invoice has many line items
    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    // An invoice can have many payments
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}