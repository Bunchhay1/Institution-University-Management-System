<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $casts = ['payment_date' => 'date'];

    // A payment belongs to one invoice
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    // A payment belongs to one student
    public function student(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class, 'student_profile_id');
    }
}