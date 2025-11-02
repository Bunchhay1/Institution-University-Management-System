<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    public function index()
    {
        // THIS IS THE FIX: We use ->all() to return a simple array
        return Position::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|unique:positions,title',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $position = Position::create($validated);
        return response()->json($position->load('department'), 201);
    }
}