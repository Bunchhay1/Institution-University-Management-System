<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;
    protected $guarded = [];

    // A course belongs to one program
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    // A course can have many sections (classes)
    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }
}