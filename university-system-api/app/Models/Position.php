<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Position extends Model
{
    use HasFactory;
    protected $guarded = [];

    // A position can be held by many employees
    public function employees(): HasMany
    {
        return $this->hasMany(EmployeeProfile::class);
    }

    // A position may belong to a specific department
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}