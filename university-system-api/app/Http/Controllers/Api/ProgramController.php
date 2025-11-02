<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        // THIS IS THE FIX: We use ->get() to return a simple array
        return Program::with('department')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:programs,name',
            'department_id' => 'required|exists:departments,id',
        ]);

        $program = Program::create($validated);
        return response()->json($program->load('department'), 201);
    }
}