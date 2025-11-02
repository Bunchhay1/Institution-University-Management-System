<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimesheetEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TimesheetEntryController extends Controller
{
    /**
     * Display a list of timesheet entries.
     */
    public function index()
    {
        // We'll get all entries and load employee details
        return TimesheetEntry::with('employee.person', 'approver.person', 'department')
                            ->orderBy('clock_in', 'desc')
                            ->get();
    }

    /**
     * Store a new timesheet entry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_profile_id' => 'required|exists:employee_profiles,id',
            'department_id' => 'nullable|exists:departments,id',
            'clock_in' => 'required|date',
            'clock_out' => 'required|date|after:clock_in',
        ]);
        
        // Calculate hours worked
        $clockIn = new Carbon($validated['clock_in']);
        $clockOut = new Carbon($validated['clock_out']);
        $hours = $clockOut->diffInMinutes($clockIn) / 60.0;
        
        $timesheetEntry = TimesheetEntry::create($validated + [
            'status' => 'submitted',
            'hours_worked' => round($hours, 2),
        ]);

        return response()->json($timesheetEntry->load('employee.person'), 201);
    }

    /**
     * Approve a timesheet entry.
     * POST /api/timesheet-entries/{timesheetEntry}/approve
     */
    public function approve(Request $request, TimesheetEntry $timesheetEntry)
    {
        $managerProfile = Auth::user()->person->employeeProfile;

        $timesheetEntry->update([
            'status' => 'approved',
            'approved_by_id' => $managerProfile->id,
        ]);
        
        return response()->json($timesheetEntry->load('employee.person', 'approver.person'));
    }

    /**
     * Reject a timesheet entry.
     * POST /api/timesheet-entries/{timesheetEntry}/reject
     */
    public function reject(Request $request, TimesheetEntry $timesheetEntry)
    {
        $managerProfile = Auth::user()->person->employeeProfile;

        $timesheetEntry->update([
            'status' => 'rejected',
            'approved_by_id' => $managerProfile->id,
        ]);
        
        return response()->json($timesheetEntry->load('employee.person', 'approver.person'));
    }
}