<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewUserWelcome;
class PersonController extends Controller
{
    public function store(Request $request)
{
    // 1. VALIDATION RULES
    $validated = $request->validate([
        // ... (all your existing validation rules are the same)
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email|unique:people,email',
        'type' => 'required|in:student,staff,both',
        'password' => ['required', 'confirmed', Password::defaults()],
        'employee_no' => 'nullable|required_if:type,staff,both|string|unique:employee_profiles,employee_no',
        'department_id' => 'nullable|required_if:type,staff,both|exists:departments,id',
        'position_id' => 'nullable|required_if:type,staff,both|exists:positions,id',
        'join_date' => 'nullable|required_if:type,staff,both|date',
        'contract_type' => 'nullable|required_if:type,staff,both|in:full-time,part-time,temporary,student-worker',
        'salary_template_id' => 'nullable|required_if:type,staff,both|exists:salary_templates,id',
        'enrollment_no' => 'nullable|required_if:type,student,both|string|unique:student_profiles,enrollment_no',
        'program_id' => 'nullable|required_if:type,student,both|exists:programs,id',
        'enrollment_date' => 'nullable|required_if:type,student,both|date',
    ]);

    // --- THIS IS THE NEW PART ---
    // We get the plain-text password to send in the email
    $tempPassword = $validated['password'];

    // 2. DATABASE TRANSACTION
    try {
        DB::beginTransaction();

        // Step 1: Create the User
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($tempPassword), // Hash it for the DB
        ]);

        // ... (The rest of the 'Person' and 'Profile' creation is the same)
        $person = Person::create([
            'user_id' => $user->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'type' => $validated['type'],
            'primary_role' => $validated['type'],
        ]);
        if ($person->type === 'staff' || $person->type === 'both') {
            $person->employeeProfile()->create([
                'employee_no' => $validated['employee_no'],
                'department_id' => $validated['department_id'],
                'position_id' => $validated['position_id'],
                'join_date' => $validated['join_date'],
                'contract_type' => $validated['contract_type'],
                'salary_template_id' => $validated['salary_template_id'],
            ]);
        }
        if ($person->type === 'student' || $person->type === 'both') {
            $person->studentProfile()->create([
                'enrollment_no' => $validated['enrollment_no'],
                'program_id' => $validated['program_id'],
                'enrollment_date' => $validated['enrollment_date'],
            ]);
        }

        // --- SEND THE EMAIL ---
        // We pass the new $user and the $tempPassword to our Mailable
        Mail::to($user->email)->send(new NewUserWelcome($user, $tempPassword));

        DB::commit();
        return response()->json($person->load(['user', 'employeeProfile', 'studentProfile']), 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Failed to create person', 'error' => $e->getMessage()], 500);
    }
}
}