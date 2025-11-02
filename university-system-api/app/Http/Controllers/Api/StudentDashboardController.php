<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentDashboardController extends Controller
{
    /**
     * Get all data for the currently logged-in student.
     */
    public function getMyData(Request $request)
    {
        $user = Auth::user();
        
        // Find the student profile linked to the logged-in user
        $studentProfile = $user->person->studentProfile;

        if (!$studentProfile) {
            return response()->json(['message' => 'You do not have a student profile.'], 403);
        }

        // Load all the data this student needs
        $studentProfile->load([
            // Get all enrollments, and for each one, get the section and course
            'enrollments.section.course', 
            
            // Get all attendance records for this student
            'attendanceRecords.section.course',
            
            // Get all invoices for this student
            'invoices'
        ]);

        return response()->json($studentProfile);
    }
}