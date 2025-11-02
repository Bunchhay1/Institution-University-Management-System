<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $casts = ['schedule' => 'array'];

    // A section is for one course
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    // A section is taught by one faculty member
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(EmployeeProfile::class, 'faculty_id');
    }

    // A section has many enrollments (the class roster)
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    // Get all students enrolled in this section
    public function students()
    {
        return $this->belongsToMany(StudentProfile::class, 'enrollments');
    }
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }
}