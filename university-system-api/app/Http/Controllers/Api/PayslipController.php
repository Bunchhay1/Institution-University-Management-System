<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payslip;
use App\Models\EmployeeProfile;
use App\Models\PayrollRun;
use Illuminate\Http\Request;

class PayslipController extends Controller
{
    /**
     * Display a listing of payslips, with filters.
     */
    public function index(Request $request)
    {
        $query = Payslip::with(['employee.person', 'payrollRun']);

        // Filter by run: /api/payroll-runs/{run}/payslips
        if ($request->payrollRun) {
            $query->where('payroll_run_id', $request->payrollRun->id);
        }
        
        // Filter by employee: /api/employees/{employee}/payslips
        if ($request->employeeProfile) {
            $query->where('employee_profile_id', $request->employeeProfile->id);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Display a single, detailed payslip.
     */
    public function show(Payslip $payslip)
    {
        return $payslip->load([
            'employee.person', 
            'employee.department', 
            'employee.position',
            'payrollRun', 
            'components' // This gets all the allowances/deductions
        ]);
    }
}