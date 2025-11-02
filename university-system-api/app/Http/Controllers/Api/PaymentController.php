<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Store a new payment for a specific invoice.
     * POST /api/invoices/{invoice}/payments
     */
    public function store(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'amount_paid' => 'required|numeric|min:0.01|max:' . $invoice->total_due,
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
        ]);

        // Create the payment record
        $payment = $invoice->payments()->create([
            'student_profile_id' => $invoice->student_profile_id,
            'amount_paid' => $validated['amount_paid'],
            'payment_date' => $validated['payment_date'],
            'payment_method' => $validated['payment_method'],
            'transaction_id' => 'TXN-' . time(), // Simple unique ID
        ]);

        // Update the invoice totals
        $invoice->total_paid += $payment->amount_paid;
        $invoice->total_due -= $payment->amount_paid;
        
        if ($invoice->total_due <= 0) {
            $invoice->status = 'paid';
        }
        
        $invoice->save();

        return response()->json($payment, 201);
    }
}