<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'person_id',
        'enrollment_no',
        'program_id',
        'enrollment_date',
        'status',
    ];

    /**
     * Get the person record this profile belongs to.
     */
    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    // A student has many enrollments
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'student_profile_id');
    }

    // Get all sections a student is enrolled in
    public function sections()
    {
        return $this->belongsToMany(Section::class, 'enrollments');
    }
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'student_profile_id');
    }
    // ... (inside StudentProfile class)

    // A student can have many invoices
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'student_profile_id');
    }

    // A student can make many payments
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'student_profile_id');
    }
}