<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradingController extends Controller
{
    /**
     * Update the grade for a single student in a class.
     * POST /api/enrollments/{enrollment}/grade
     */
    public function updateGrade(Request $request, Enrollment $enrollment)
    {
        // In a real app, we would check if the logged-in user
        // is the faculty for this enrollment's section.
        // For now, we will allow any authenticated user.
        
        $validated = $request->validate([
            'grade' => 'required|string|max:5', // e.g., "A+", "B-", "95"
        ]);

        $enrollment->update([
            'grade' => $validated['grade'],
            'status' => 'completed', // Mark the class as completed
        ]);

        return response()->json($enrollment, 200);
    }
}