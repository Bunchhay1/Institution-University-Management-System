<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;
    protected $guarded = [];

    // A team belongs to one department
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    // A team has one team lead
    public function lead(): BelongsTo
    {
        return $this->belongsTo(EmployeeProfile::class, 'team_lead_id');
    }

    // A team can have many members (employees)
    public function members(): HasMany
    {
        return $this->hasMany(EmployeeProfile::class);
    }
}