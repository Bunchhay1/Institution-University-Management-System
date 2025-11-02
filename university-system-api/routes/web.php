<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// We use Route::apiResource to automatically create all
// standard endpoints (GET, POST, PUT, DELETE) for each module.

// People & Profiles
Route::apiResource('people', PersonController::class);
// Note: We will add Student/Employee profile endpoints later,
// often nested under the 'people' route.

// HR Management
Route::apiResource('departments', DepartmentController::class);
Route::apiResource('positions', PositionController::class);
Route::apiResource('teams', TeamController::class);

// Academic Management
Route::apiResource('programs', ProgramController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('sections', SectionController::class);
Route::apiResource('enrollments', EnrollmentController::class)->only(['index', 'show', 'destroy']); // See below

// We need custom routes for enrolling a student,
// as it's a specific action.
Route::post('sections/{section}/enroll', [EnrollmentController::class, 'enrollStudent']);

// You might also want routes to view enrollments by student or section
Route::get('students/{student_profile}/enrollments', [EnrollmentController::class, 'getStudentEnrollments']);
Route::get('sections/{section}/enrollments', [EnrollmentController::class, 'getSectionEnrollments']);

// 1. Salary Templates and their Components
Route::apiResource('salary-templates', SalaryTemplateController::class);
Route::apiResource('salary-templates.pay-components', PayComponentController::class)->shallow();

// 2. Payroll Runs
Route::apiResource('payroll-runs', PayrollRunController::class);

// Custom actions for a payroll run
Route::post('payroll-runs/{payrollRun}/generate-payslips', [PayrollRunController::class, 'generatePayslips']);
Route::post('payroll-runs/{payrollRun}/approve', [PayrollRunController::class, 'approveRun']);

// 3. Payslips (mostly for viewing)
Route::get('payslips', [PayslipController::class, 'index']); // List all
Route::get('payslips/{payslip}', [PayslipController::class, 'show']); // View one
Route::get('payroll-runs/{payrollRun}/payslips', [PayslipController::class, 'index']); // Filter by run
Route::get('employees/{employeeProfile}/payslips', [PayslipController::class, 'index']); // Filter by employee


// 1. Student Attendance
Route::apiResource('attendance-records', AttendanceRecordController::class);
// Custom routes for getting attendance by section/student
Route::get('sections/{section}/attendance', [AttendanceRecordController::class, 'index']);
Route::get('students/{student_profile}/attendance', [AttendanceRecordController::class, 'index']);
// Custom route for a faculty member to submit attendance for a class
Route::post('sections/{section}/mark-attendance', [AttendanceRecordController::class, 'markSectionAttendance']);


// 2. Staff Leave Requests
Route::apiResource('leave-requests', LeaveRequestController::class);
// Custom routes for a manager to approve/reject
Route::post('leave-requests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve']);
Route::post('leave-requests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject']);


// 3. Staff/Student-Worker Timesheets
Route::apiResource('timesheet-entries', TimesheetEntryController::class);
// Custom routes for a manager to approve/reject
Route::post('timesheet-entries/{timesheetEntry}/approve', [TimesheetEntryController::class, 'approve']);
Route::post('timesheet-entries/{timesheetEntry}/reject', [TimesheetEntryController::class, 'reject']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


require __DIR__.'/auth.php';
