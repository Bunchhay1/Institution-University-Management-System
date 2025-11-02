<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceRecordController extends Controller
{
    /**
     * Get attendance records, filtered by section or student.
     */
    public function index(Request $request)
    {
        $query = AttendanceRecord::with(['student.person', 'section.course']);

        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }
        
        if ($request->has('student_profile_id')) {
            $query->where('student_profile_id', $request->student_profile_id);
        }

        return $query->orderBy('date', 'desc')->get();
    }

    /**
     * This is the main function for a faculty member to
     * submit attendance for their entire class.
     * POST /api/sections/{section}/mark-attendance
     */
    public function markSectionAttendance(Request $request, Section $section)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_profile_id' => 'required|exists:student_profiles,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
        ]);

        $records = [];
        $markerId = Auth::id(); // The logged-in faculty member

        foreach ($validated['attendances'] as $att) {
            // updateOrCreate will find an existing record or make a new one
            $records[] = AttendanceRecord::updateOrCreate(
                [
                    'section_id' => $section->id,
                    'student_profile_id' => $att['student_profile_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $att['status'],
                    'marked_by_user_id' => $markerId,
                ]
            );
        }

        return response()->json($records, 201);
    }
}