<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmployeeProfile;
use App\Models\PayrollRun;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PayrollRunController extends Controller
{
    public function index()
    {
        // Get all runs, newest first
        return PayrollRun::with('processor')->orderBy('end_date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $payrollRun = PayrollRun::create($validated + [
            'status' => 'draft',
            'processed_by_user_id' => Auth::id(),
        ]);
        
        return response()->json($payrollRun, 201);
    }

    public function show(PayrollRun $payrollRun)
    {
        // Show a run and all its payslips with employee details
        return $payrollRun->load(['payslips.employee.person']);
    }

    /**
     * This is the main function that generates all payslips for a run.
     * POST /api/payroll-runs/{payrollRun}/generate-payslips
     */
    public function generatePayslips(PayrollRun $payrollRun)
    {
        if ($payrollRun->status !== 'draft') {
            return response()->json(['message' => 'Payroll run is not in draft status.'], 422);
        }

        // Use a transaction to ensure all or nothing is created
        return DB::transaction(function () use ($payrollRun) {
            
            // 1. Find all active employees who have a salary template
            $employees = EmployeeProfile::whereNotNull('salary_template_id')
                ->where('status', 'active')
                ->with('salaryTemplate.payComponents') // Load the template and its components
                ->get();

            $payslipCount = 0;
            foreach ($employees as $employee) {
                // Skip if this employee already has a payslip in this run
                if ($payrollRun->payslips()->where('employee_profile_id', $employee->id)->exists()) {
                    continue;
                }

                $template = $employee->salaryTemplate;
                $baseSalary = $template->base_salary;
                $totalAllowances = 0;
                $totalDeductions = 0;

                // 2. Create the main payslip record
                $payslip = $payrollRun->payslips()->create([
                    'employee_profile_id' => $employee->id,
                    'gross_salary' => $baseSalary, // Start with base
                    'total_allowances' => 0,
                    'total_deductions' => 0,
                    'net_salary' => 0, // Will calculate at the end
                ]);

                // 3. Copy all pay components from the template to the payslip
                foreach ($template->payComponents as $component) {
                    $amount = $component->amount;
                    if ($component->is_percentage) {
                        $amount = ($baseSalary * $component->amount) / 100;
                    }

                    $payslip->components()->create([
                        'name' => $component->name,
                        'type' => $component->type,
                        'amount' => $amount,
                    ]);

                    if ($component->type === 'allowance') {
                        $totalAllowances += $amount;
                    } else {
                        $totalDeductions += $amount;
                    }
                }

                // 4. Update the final payslip totals
                $payslip->update([
                    'gross_salary' => $baseSalary + $totalAllowances,
                    'total_allowances' => $totalAllowances,
                    'total_deductions' => $totalDeductions,
                    'net_salary' => ($baseSalary + $totalAllowances) - $totalDeductions,
                ]);
                
                $payslipCount++;
            }
            
            // 5. Update the payroll run status
            $payrollRun->update(['status' => 'pending_approval']);
            
            return response()->json([
                'message' => "Successfully generated $payslipCount payslips.",
                'payroll_run' => $payrollRun->load('payslips.employee.person'),
            ]);
        });
    }
}