import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const TimesheetsPage = () => {
    const [entries, setEntries] = useState([]);
    const [employees, setEmployees] = useState([]); // For the 'submit for' dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [formEmployee, setFormEmployee] = useState('');
    const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
    const [formClockIn, setFormClockIn] = useState('09:00');
    const [formClockOut, setFormClockOut] = useState('17:00');
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [entriesRes, employeesRes] = await Promise.all([
                apiClient.get('/api/timesheet-entries'),
                apiClient.get('/api/people?type=staff') // Get all staff
            ]);
            
            setEntries(Array.isArray(entriesRes.data) ? entriesRes.data : []);
            const staffData = Array.isArray(employeesRes.data) ? employeesRes.data : [];
            setEmployees(staffData);

            // Set default employee for the form
            if (staffData.length > 0 && !formEmployee) {
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
        
        // Combine date and time into full ISO strings
        const clockInDateTime = `${formDate}T${formClockIn}:00`;
        const clockOutDateTime = `${formDate}T${formClockOut}:00`;
        
        try {
            await apiClient.post('/api/timesheet-entries', {
                employee_profile_id: formEmployee,
                clock_in: clockInDateTime,
                clock_out: clockOutDateTime,
            });
            fetchData(); // Refresh list
        } catch (err) {
            setFormError('An error occurred. Make sure Clock Out is after Clock In.');
        }
    };
    
    // --- Functions to Approve/Reject ---
    const handleApprove = async (id) => {
        try {
            await apiClient.post(`/api/timesheet-entries/${id}/approve`);
            fetchData(); // Refresh list
        } catch (err) {
            alert('Failed to approve entry.');
        }
    };
    
    const handleReject = async (id) => {
        try {
            await apiClient.post(`/api/timesheet-entries/${id}/reject`);
            fetchData(); // Refresh list
        } catch (err) {
            alert('Failed to reject entry.');
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ display: 'flex' }}>
            {/* Column 1: Entry List */}
            <div style={{ flex: 3, paddingRight: '20px' }}>
                <h2>Timesheet Entries</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Employee</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Clock In</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Clock Out</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Hours</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => (
                            <tr key={entry.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {entry.employee.person.first_name} {entry.employee.person.last_name}
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(entry.clock_in).toLocaleString()}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(entry.clock_out).toLocaleString()}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{entry.hours_worked}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd', textTransform: 'capitalize' }}>
                                    {entry.status}
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {entry.status === 'submitted' && (
                                        <>
                                            <button onClick={() => handleApprove(entry.id)} style={{ color: 'green', marginRight: '5px' }}>Approve</button>
                                            <button onClick={() => handleReject(entry.id)} style={{ color: 'red' }}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Column 2: New Entry Form */}
            <div style={{ flex: 1 }}>
                <h3>Submit New Timesheet</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Submit for:</label>
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
                        <label>Date:</label>
                        <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Clock In Time:</label>
                        <input type="time" value={formClockIn} onChange={(e) => setFormClockIn(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Clock Out Time:</label>
                        <input type="time" value={formClockOut} onChange={(e) => setFormClockOut(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    <button type="submit" style={{ width: '100%' }}>
                        Submit Hours
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TimesheetsPage;