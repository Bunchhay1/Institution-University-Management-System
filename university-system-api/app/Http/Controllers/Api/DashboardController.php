<?php

namespace App\HttpAcl\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Person;
use App\Models\Program;
use App\Models\Section;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get all dashboard stats at once.
     */
    public function getStats(Request $request)
    {
        $stats = [
            'total_students' => Person::where('type', 'student')->orWhere('type', 'both')->count(),
            'total_staff' => Person::where('type', 'staff')->orWhere('type', 'both')->count(),
            'total_programs' => Program::count(),
            'total_courses' => Course::count(),
            'total_sections' => Section::count(),
        ];

        return response()->json($stats);
    }
}