<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function enrollStudent(Request $request, Section $section)
{
    $validated = $request->validate([
        'student_profile_id' => 'required|exists:student_profiles,id',
    ]);

    $studentId = $validated['student_profile_id'];

    // 1. Check if section is full
    $currentEnrollments = $section->enrollments()->count();
    if ($currentEnrollments >= $section->capacity) {
        return response()->json(['message' => 'Section is full.'], 422);
    }

    // 2. Check if student is already enrolled
    $isEnrolled = $section->enrollments()
                          ->where('student_profile_id', $studentId)
                          ->exists();

    if ($isEnrolled) {
        return response()->json(['message' => 'Student is already enrolled.'], 422);
    }

    // 3. Create the enrollment
    $enrollment = $section->enrollments()->create([
        'student_profile_id' => $studentId,
        'status' => 'enrolled',
    ]);

    return response()->json($enrollment, 201);
}
    public function index()
    {
        // THIS IS THE FIX: We use ->get() to return a simple array
        return Section::with(['course', 'faculty.person'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'faculty_id' => 'required|exists:employee_profiles,id',
            'term' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'schedule' => 'nullable|string', 
        ]);

        $section = Section::create($validated);
        return response()->json($section->load(['course', 'faculty.person']), 201);
    }
}       