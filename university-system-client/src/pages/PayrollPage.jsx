import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const PayrollPage = () => {
    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/api/payroll-runs');
            setRuns(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateRun = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await apiClient.post('/api/payroll-runs', {
                title: title,
                start_date: startDate,
                end_date: endDate,
            });
            fetchData(); // Refresh list
            setTitle('');
            setStartDate('');
            setEndDate('');
        } catch (err) {
            setFormError('An error occurred.');
        }
    };

    const handleGeneratePayslips = async (runId) => {
        if (!window.confirm('Are you sure you want to generate payslips for this run? This cannot be undone.')) {
            return;
        }
        
        try {
            // This calls our new "engine" function
            await apiClient.post(`/api/payroll-runs/${runId}/generate-payslips`);
            fetchData(); // Refresh to show new status
        } catch (err) {
            alert('Failed to generate payslips.');
            console.error(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ display: 'flex' }}>
            {/* Column 1: Payroll Run List */}
            <div style={{ flex: 2, paddingRight: '20px' }}>
                <h2>Payroll Runs</h2>
                {runs.map((run) => (
                    <div key={run.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                        <h3><Link to={`/payroll/${run.id}`}>{run.title}</Link></h3>
                        <p>Period: {run.start_date} to {run.end_date}</p>
                        <p>Status: <strong style={{ textTransform: 'capitalize' }}>{run.status}</strong></p>
                        
                        {run.status === 'draft' && (
                            <button onClick={() => handleGeneratePayslips(run.id)}>
                                Generate Payslips
                            </button>
                        )}

                        {run.status !== 'draft' && (
                            <p>{run.payslips_count || 0} Payslips Generated</p>
                            // We can add a "View Payslips" link here later
                        )}
                    </div>
                ))}
            </div>

            {/* Column 2: Create New Run Form */}
            <div style={{ flex: 1 }}>
                <h3>Create New Payroll Run</h3>
                <form onSubmit={handleCreateRun}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Run Title:</label>
                        <input
                            type="text"
                            placeholder="e.g., October 2025 Payroll"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Pay Period Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Pay Period End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    <button type="submit" style={{ width: '100%' }}>
                        Create Run
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PayrollPage;