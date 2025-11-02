import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const LeaveRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [employees, setEmployees] = useState([]); // For the 'request as' dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [formEmployee, setFormEmployee] = useState('');
    const [formType, setFormType] = useState('Annual');
    const [formStart, setFormStart] = useState('');
    const [formEnd, setFormEnd] = useState('');
    const [formReason, setFormReason] = useState('');
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [requestsRes, employeesRes] = await Promise.all([
                apiClient.get('/api/leave-requests'),
                apiClient.get('/api/people?type=staff') // Get all staff
            ]);
            
            setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
            const staffData = Array.isArray(employeesRes.data) ? employeesRes.data : [];
            setEmployees(staffData);

            // Set default employee for the form
            if (staffData.length > 0) {
                setFormEmployee(staffData[0].employee_profile.id);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await apiClient.post('/api/leave-requests', {
                employee_profile_id: formEmployee,
                leave_type: formType,
                start_date: formStart,
                end_date: formEnd,
                reason: formReason,
            });
            fetchData(); // Refresh list
            // Clear form
            setFormReason('');
            setFormStart('');
            setFormEnd('');
        } catch (err) {
            setFormError('An error occurred.');
        }
    };
    
    // --- Functions to Approve/Reject (for managers) ---
    const handleApprove = async (id) => {
        try {
            await apiClient.post(`/api/leave-requests/${id}/approve`);
            fetchData(); // Refresh list
        } catch (err) {
            alert('Failed to approve request.');
        }
    };
    
    const handleReject = async (id) => {
        const notes = prompt('Please provide a reason for rejection:');
        if (!notes) return; // User cancelled
        
        try {
            await apiClient.post(`/api/leave-requests/${id}/reject`, { rejection_notes: notes });
            fetchData(); // Refresh list
        } catch (err) {
            alert('Failed to reject request.');
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ display: 'flex' }}>
            {/* Column 1: Request List */}
            <div style={{ flex: 3, paddingRight: '20px' }}>
                <h2>Leave Requests</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Employee</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Type</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Dates</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {req.employee.person.first_name} {req.employee.person.last_name}
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.leave_type}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.start_date} to {req.end_date}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd', textTransform: 'capitalize' }}>
                                    {req.status}
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {req.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleApprove(req.id)} style={{ color: 'green', marginRight: '5px' }}>Approve</button>
                                            <button onClick={() => handleReject(req.id)} style={{ color: 'red' }}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Column 2: New Request Form */}
            <div style={{ flex: 1 }}>
                <h3>Submit New Leave Request</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Requesting as:</label>
                        <select
                            value={formEmployee}
                            onChange={(e) => setFormEmployee(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        >
                            {employees.map((person) => (
                                <option key={person.employee_profile.id} value={person.employee_profile.id}>
                                    {person.first_name} {person.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Leave Type:</label>
                        <select value={formType} onChange={(e) => setFormType(e.target.value)} style={{ width: '100%' }}>
                            <option value="Annual">Annual</option>
                            <option value="Sick">Sick</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Start Date:</label>
                        <input type="date" value={formStart} onChange={(e) => setFormStart(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>End Date:</label>
                        <input type="date" value={formEnd} onChange={(e) => setFormEnd(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Reason:</label>
                        <textarea
                            value={formReason}
                            onChange={(e) => setFormReason(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    <button type="submit" style={{ width: '100%' }}>
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LeaveRequestsPage;