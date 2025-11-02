<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'person_id',
        'employee_no',
        'position_id',
        'department_id',
        'salary_template_id',
        'join_date',
        'contract_type',
        'manager_id',
        'status',
    ];

    protected $casts = [
        'join_date' => 'date',
    ];

    /**
     * Get the person record this profile belongs to.
     */
    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    // An employee belongs to one team
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    // An employee has one position
    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }
    public function sectionsTaught(): HasMany
    {
        return $this->hasMany(Section::class, 'faculty_id');
    }
    // ... (inside EmployeeProfile class)
    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class, 'employee_profile_id');
    }

    public function timesheetEntries(): HasMany
    {
        return $this->hasMany(TimesheetEntry::class, 'employee_profile_id');
    }
}