<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalaryTemplate;
use Illuminate\Http\Request;

class SalaryTemplateController extends Controller
{
    public function index()
    {
        // Load the 'payComponents' relationship
        return SalaryTemplate::with('payComponents')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:salary_templates,name',
            'base_salary' => 'required|numeric|min:0',
        ]);

        $template = SalaryTemplate::create($validated);
        
        return response()->json($template->load('payComponents'), 201);
    }

    public function show(SalaryTemplate $salaryTemplate)
    {
        return $salaryTemplate->load('payComponents');
    }
    
    public function destroy(SalaryTemplate $salaryTemplate)
    {
        $salaryTemplate->delete();
        return response()->noContent();
    }
}