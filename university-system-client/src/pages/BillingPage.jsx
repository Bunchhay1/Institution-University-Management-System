import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';
import LogPaymentModal from '../components/LogPaymentModal.jsx'; // <-- 1. IMPORT THE MODAL

const BillingPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 2. ADD MODAL STATE ---
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Form state
    const [selectedStudent, setSelectedStudent] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: '' }]);
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invoiceRes, studentRes] = await Promise.all([
                apiClient.get('/api/invoices'),
                apiClient.get('/api/people?type=student')
            ]);
            
            setInvoices(Array.isArray(invoiceRes.data) ? invoiceRes.data : []);
            const studentData = Array.isArray(studentRes.data) ? studentRes.data : [];
            setStudents(studentData);
            
            if (studentData.length > 0 && !selectedStudent) {
                setSelectedStudent(studentData[0].student_profile.id);
            }
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- (Form handlers remain the same) ---
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };
    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit_price: '' }]);
    };
    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await apiClient.post('/api/invoices', {
                student_profile_id: selectedStudent,
                issue_date: issueDate,
                due_date: dueDate,
                items: items,
            });
            fetchData(); // Refresh list
            setItems([{ description: '', quantity: 1, unit_price: '' }]);
        } catch (err) {
            setFormError('An error occurred.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <> {/* --- 3. ADD FRAGMENT & MODAL --- */}
            {selectedInvoice && (
                <LogPaymentModal
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                    onPaymentSuccess={fetchData}
                />
            )}

            <div style={{ display: 'flex' }}>
                {/* Column 1: Invoice List */}
                <div style={{ flex: 2, paddingRight: '20px' }}>
                    <h2>Invoices</h2>
                    {invoices.map((invoice) => (
                        <div key={invoice.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3>{invoice.invoice_number} - {invoice.student.person.first_name} {invoice.student.person.last_name}</h3>
                                {/* --- 4. ADD LOG PAYMENT BUTTON --- */}
                                {invoice.status !== 'paid' && (
                                    <button 
                                        onClick={() => setSelectedInvoice(invoice)}
                                        style={{ background: 'green', color: 'white', height: '40px' }}
                                    >
                                        Log Payment
                                    </button>
                                )}
                            </div>
                            <p>Status: <strong style={{ textTransform: 'capitalize', color: invoice.status === 'paid' ? 'green' : 'red' }}>{invoice.status}</strong></p>
                            <p>Due Date: {invoice.due_date}</p>
                            <p>Total: ${parseFloat(invoice.subtotal).toFixed(2)} | Paid: ${parseFloat(invoice.total_paid).toFixed(2)} | Due: ${parseFloat(invoice.total_due).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* Column 2: Create New Invoice (This part is unchanged) */}
                <div style={{ flex: 1 }}>
                    <h3>Create New Invoice</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Student:</label>
                            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required style={{ width: '100%' }}>
                                {students.map((person) => (
                                    <option key={person.student_profile.id} value={person.student_profile.id}>
                                        {person.first_name} {person.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Issue Date:</label>
                            <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Due Date:</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                        
                        <hr />
                        <h4>Invoice Items</h4>
                        {items.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required style={{ flex: 3 }} />
                                <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required style={{ flex: 1 }} />
                                <input type="number" step="0.01" placeholder="Price" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} required style={{ flex: 1 }} />
                                <button type="button" onClick={() => removeItem(index)} style={{ background: 'red', color: 'white' }}>X</button>
                            </div>
                        ))}
                        <button type="button" onClick={addItem} style={{ width: '100%', marginBottom: '10px' }}>+ Add Item</button>

                        {formError && <p style={{ color: 'red' }}>{formError}</p>}
                        <button type="submit" style={{ width: '100%', background: 'blue', color: 'white', padding: '10px' }}>
                            Create Invoice
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BillingPage;