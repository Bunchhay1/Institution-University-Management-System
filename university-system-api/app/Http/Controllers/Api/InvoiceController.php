<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\StudentProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {
        // Load invoices with their student and item details
        return Invoice::with('student.person', 'items')->orderBy('issue_date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_profile_id' => 'required|exists:student_profiles,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_price'];
            }

            // Create the main invoice
            $invoice = Invoice::create([
                'student_profile_id' => $validated['student_profile_id'],
                'issue_date' => $validated['issue_date'],
                'due_date' => $validated['due_date'],
                'subtotal' => $subtotal,
                'total_due' => $subtotal,
                'total_paid' => 0,
                'status' => 'due',
                'invoice_number' => 'INV-' . time(), // Simple unique number
            ]);

            // Create the invoice items
            foreach ($validated['items'] as $item) {
                $invoice->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_amount' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            return response()->json($invoice->load('student.person', 'items'), 201);
        });
    }
}