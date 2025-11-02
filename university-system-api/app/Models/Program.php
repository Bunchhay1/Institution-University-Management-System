<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    use HasFactory;
    protected $guarded = [];

    // A program belongs to a department
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    // A program has many courses
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    // A program has many students
    public function students(): HasMany
    {
        return $this->hasMany(StudentProfile::class);
    }
}