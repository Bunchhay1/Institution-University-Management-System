<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- Import ALL necessary controllers ---
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\StudentDashboardController;
use App\Http\Controllers\Api\GradingController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PersonController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\SalaryTemplateController;
use App\Http\Controllers\Api\PayComponentController;
use App\Http\Controllers\Api\PayrollRunController;
use App\Http\Controllers\Api\PayslipController;
use App\Http\Controllers\Api\AttendanceRecordController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\TimesheetEntryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Public Authentication Routes ---
// This file (routes/auth.php) contains your /api/login, /api/register routes.
require __DIR__.'/auth.php';


// --- Protected Data Routes ---
// All routes in this group require the user to be logged in.
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user()->load('person');
    });

    // --- Dashboard ---
    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);

    // --- People & HR Management ---
    Route::apiResource('people', PersonController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('positions', PositionController::class);
    Route::apiResource('teams', TeamController::class);
    Route::get('faculty', [FacultyController::class, 'index']);

    // --- Academic Management ---
    Route::apiResource('programs', ProgramController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('sections', SectionController::class);
    Route::apiResource('enrollments', EnrollmentController::class)->only(['index', 'show', 'destroy']);
    Route::post('sections/{section}/enroll', [EnrollmentController::class, 'enrollStudent']);
    Route::get('students/{student_profile}/enrollments', [EnrollmentController::class, 'getStudentEnrollments']);
    Route::get('sections/{section}/enrollments', [EnrollmentController::class, 'getSectionEnrollments']);
    Route::post('enrollments/{enrollment}/grade', [GradingController::class, 'updateGrade']);

    // --- Payroll Engine ---
    Route::apiResource('salary-templates', SalaryTemplateController::class);
    Route::apiResource('salary-templates.pay-components', PayComponentController::class)->shallow();
    Route::apiResource('payroll-runs', PayrollRunController::class);
    Route::post('payroll-runs/{payrollRun}/generate-payslips', [PayrollRunController::class, 'generatePayslips']);
    Route::post('payroll-runs/{payrollRun}/approve', [PayrollRunController::class, 'approveRun']);
    Route::get('payslips', [PayslipController::class, 'index']);
    Route::get('payslips/{payslip}', [PayslipController::class, 'show']);
    Route::get('payroll-runs/{payrollRun}/payslips', [PayrollRunController::class, 'index']);
    Route::get('employees/{employeeProfile}/payslips', [PayrollRunController::class, 'index']);

    // --- Attendance & Absence ---
    Route::apiResource('attendance-records', AttendanceRecordController::class);
    Route::apiResource('leave-requests', LeaveRequestController::class);
    Route::apiResource('timesheet-entries', TimesheetEntryController::class);
    Route::get('sections/{section}/attendance', [AttendanceRecordController::class, 'index']);
    Route::get('students/{student_profile}/attendance', [AttendanceRecordController::class, 'index']);
    Route::post('sections/{section}/mark-attendance', [AttendanceRecordController::class, 'markSectionAttendance']);
    Route::post('leave-requests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve']);
    Route::post('leave-requests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject']);
    Route::post('timesheet-entries/{timesheetEntry}/approve', [TimesheetEntryController::class, 'approve']);
    Route::post('timesheet-entries/{timesheetEntry}/reject', [TimesheetEntryController::class, 'reject']);

    // --- Finance & Billing ---
    Route::apiResource('invoices', InvoiceController::class)->only(['index', 'store']);
    Route::post('invoices/{invoice}/payments', [PaymentController::class, 'store']);
    
    // --- Student Dashboard ---
    Route::get('/my-dashboard', [StudentDashboardController::class, 'getMyData']);
});