<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeeProfile;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index()
    {
        // Get all employee profiles and load their 'person' details
        // In the future, we can filter this by position (e.g., 'Faculty')
        return EmployeeProfile::with('person')->where('status', 'active')->get();
    }
}