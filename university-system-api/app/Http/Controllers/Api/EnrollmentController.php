<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Section;
use App\Models\StudentProfile;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Custom method to enroll a student in a section.
     * POST /api/sections/{section}/enroll
     */
    public function enrollStudent(Request $request, Section $section)
    {
        $validatedData = $request->validate([
            'student_profile_id' => 'required|exists:student_profiles,id',
        ]);

        $studentId = $validatedData['student_profile_id'];

        // 1. Check if section is full
        $currentEnrollments = $section->enrollments()->count();
        if ($currentEnrollments >= $section->capacity) {
            return response()->json(['message' => 'Section is full.'], 422);
        }

        // 2. Check if student is already enrolled
        $isEnrolled = Enrollment::where('section_id', $section->id)
                                ->where('student_profile_id', $studentId)
                                ->exists();

        if ($isEnrolled) {
            return response()->json(['message' => 'Student is already enrolled in this section.'], 422);
        }

        // 3. Create the enrollment
        $enrollment = Enrollment::create([
            'student_profile_id' => $studentId,
            'section_id' => $section->id,
            'status' => 'enrolled',
        ]);

        return response()->json($enrollment, 201);
    }

    /**
     * Get all enrollments for a specific student.
     * GET /api/students/{student_profile}/enrollments
     */
    public function getStudentEnrollments(StudentProfile $student_profile)
    {
        return $student_profile->enrollments()->with(['section.course'])->get();
    }

    /**
     * Get all enrollments (roster) for a specific section.
     * GET /api/sections/{section}/enrollments
     */
    public function getSectionEnrollments(Section $section)
    {
        return $section->enrollments()->with(['student.person'])->get();
    }


    // Standard CRUD functions for viewing/deleting individual enrollments

    public function index()
    {
        // General list, probably not as useful
        return Enrollment::with(['student', 'section'])->paginate(50);
    }

    public function show(Enrollment $enrollment)
    {
        return $enrollment->load(['student', 'section']);
    }

    /**
     * Un-enroll a student (Delete the enrollment record).
     * DELETE /api/enrollments/{enrollment}
     */
    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();
        return response()->noContent();
    }
}