<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaveRequestController extends Controller
{
    /**
     * Display a list of leave requests.
     * In a real app, you'd filter this based on user role (e.g., manager sees their team)
     */
    public function index()
    {
        // For now, we'll get all requests and load the employee details
        return LeaveRequest::with('employee.person', 'approver.person')
                            ->orderBy('start_date', 'desc')
                            ->get();
    }

    /**
     * Store a new leave request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // In a real app, this would come from the logged-in user
            'employee_profile_id' => 'required|exists:employee_profiles,id', 
            'leave_type' => 'required|string',
            'reason' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        
        $leaveRequest = LeaveRequest::create($validated + [
            'status' => 'pending'
        ]);
        
        return response()->json($leaveRequest->load('employee.person'), 201);
    }

    /**
     * Approve a leave request.
     * POST /api/leave-requests/{leaveRequest}/approve
     */
    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        // Get the logged-in user's employee profile
        $managerProfile = Auth::user()->person->employeeProfile;

        $leaveRequest->update([
            'status' => 'approved',
            'approved_by_id' => $managerProfile->id,
        ]);
        
        return response()->json($leaveRequest->load('employee.person', 'approver.person'));
    }

    /**
     * Reject a leave request.
     * POST /api/leave-requests/{leaveRequest}/reject
     */
    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        $validated = $request->validate(['rejection_notes' => 'required|string']);
        $managerProfile = Auth::user()->person->employeeProfile;

        $leaveRequest->update([
            'status' => 'rejected',
            'approved_by_id' => $managerProfile->id,
            'rejection_notes' => $validated['rejection_notes'],
        ]);
        
        return response()->json($leaveRequest->load('employee.person', 'approver.person'));
    }
}