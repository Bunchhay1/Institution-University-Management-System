import React, { useState } from 'react';
import apiClient from '../api/axios.js';

// --- This is the Modal Component ---
const LogPaymentModal = ({ invoice, onClose, onPaymentSuccess }) => {
    const [amount, setAmount] = useState(invoice.total_due);
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (amount > invoice.total_due) {
            setError('Payment cannot be more than the amount due.');
            return;
        }

        try {
            // Call the API endpoint we already built
            await apiClient.post(`/api/invoices/${invoice.id}/payments`, {
                amount_paid: amount,
                payment_date: paymentDate,
                payment_method: paymentMethod,
            });
            
            onPaymentSuccess(); // Tell the parent page to refresh
            onClose(); // Close the modal
        } catch (err) {
            setError('Failed to log payment.');
            console.error(err);
        }
    };

    // --- Modal Styles ---
    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    };
    const modalContentStyle = {
        background: 'white', padding: '20px', borderRadius: '8px',
        width: '400px',
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <h3>Log Payment for {invoice.invoice_number}</h3>
                <p>Amount Due: ${parseFloat(invoice.total_due).toFixed(2)}</p>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Payment Amount:</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Payment Date:</label>
                        <input
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Payment Method:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Cash">Cash</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" style={{ background: 'blue', color: 'white' }}>Log Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogPaymentModal;