<?php
use App\Http\Controllers\Api\PayComponentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\StudentDashboardController;
use App\Http\Controllers\Api\GradingController;
// --- Import ALL necessary controllers ---
// Auth
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
// People & HR
use App\Http\Controllers\Api\PersonController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\TeamController;

// Academic
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\EnrollmentController;

// Payroll
use App\Http\Controllers\Api\SalaryTemplateController;
 // <-- This was missing
use App\Http\Controllers\Api\PayrollRunController;
use App\Http\Controllers\Api\PayslipController;

// Attendance
use App\Http\Controllers\Api\AttendanceRecordController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\TimesheetEntryController;
// --- Import ALL necessary controllers ---



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes here are prefixed with /api by default
*/

// This is the main route for checking if a user is logged in.
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    // This will now return the User AND their linked Person profile
    return $request->user()->load('person');
});
// --- Dashboard ---
Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);
// --- People & HR Management ---
Route::apiResource('people', PersonController::class);
Route::apiResource('departments', DepartmentController::class);
Route::apiResource('positions', PositionController::class);
Route::apiResource('teams', TeamController::class);

// --- Academic Management ---
Route::apiResource('programs', ProgramController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('sections', SectionController::class);
Route::apiResource('enrollments', EnrollmentController::class)->only(['index', 'show', 'destroy']);
Route::get('sections/{section}/enrollments', [EnrollmentController::class, 'getSectionEnrollments']);

// --- ADD THIS NEW GRADING ROUTE ---
Route::post('enrollments/{enrollment}/grade', [GradingController::class, 'updateGrade']);
// Custom Academic Routes
Route::post('sections/{section}/enroll', [EnrollmentController::class, 'enrollStudent']);
Route::get('students/{student_profile}/enrollments', [EnrollmentController::class, 'getStudentEnrollments']);
Route::get('sections/{section}/enrollments', [EnrollmentController::class, 'getSectionEnrollments']);
Route::apiResource('sections', SectionController::class); // <-- ADD THIS
Route::get('faculty', [FacultyController::class, 'index']);
// --- Payroll Engine ---
Route::apiResource('salary-templates', SalaryTemplateController::class);
Route::apiResource('salary-templates.pay-components', PayComponentController::class)->shallow();
Route::apiResource('payroll-runs', PayrollRunController::class);

// Custom Payroll Routes
Route::post('payroll-runs/{payrollRun}/generate-payslips', [PayrollRunController::class, 'generatePayslips']);
Route::post('payroll-runs/{payrollRun}/approve', [PayrollRunController::class, 'approveRun']);
Route::get('payslips', [PayslipController::class, 'index']);
Route::get('payslips/{payslip}', [PayslipController::class, 'show']);
Route::get('payroll-runs/{payrollRun}/payslips', [PayslipController::class, 'index']);
Route::get('employees/{employeeProfile}/payslips', [PayslipController::class, 'index']);

// --- Attendance & Absence ---
Route::apiResource('attendance-records', AttendanceRecordController::class);
Route::apiResource('leave-requests', LeaveRequestController::class);
Route::apiResource('timesheet-entries', TimesheetEntryController::class);

// Custom Attendance Routes
Route::get('sections/{section}/attendance', [AttendanceRecordController::class, 'index']);
Route::get('students/{student_profile}/attendance', [AttendanceRecordController::class, 'index']);
Route::post('sections/{section}/mark-attendance', [AttendanceRecordController::class, 'markSectionAttendance']);

// Custom Leave/Timesheet Routes
Route::post('leave-requests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve']);
Route::post('leave-requests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject']);
Route::post('timesheet-entries/{timesheetEntry}/approve', [TimesheetEntryController::class, 'approve']);
Route::post('timesheet-entries/{timesheetEntry}/reject', [TimesheetEntryController::class, 'reject']);
// --- Finance & Billing ---
Route::apiResource('invoices', InvoiceController::class)->only(['index', 'store']);
Route::post('invoices/{invoice}/payments', [PaymentController::class, 'store']);
// --- Student Dashboard ---
Route::get('/my-dashboard', [StudentDashboardController::class, 'getMyData']);

// This file (routes/auth.php) contains your /api/login, /api/register, /api/logout routes.
// We keep them separate to stay organized.
require __DIR__.'/auth.php';

// --- THE STRAY '}' CHARACTER WAS HERE, IT IS NOW REMOVED ---