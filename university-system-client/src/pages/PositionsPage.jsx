import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const PositionsPage = () => {
    const [positions, setPositions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        try {
            const [posRes, deptsRes] = await Promise.all([
                apiClient.get('/api/positions'),
                apiClient.get('/api/departments')
            ]);
            
            // --- THIS IS THE FIX ---
            const posData = Array.isArray(posRes.data) ? posRes.data : (posRes.data.data || []);
            const deptsData = Array.isArray(deptsRes.data) ? deptsRes.data : (deptsRes.data.data || []);

            setPositions(posData);
            setDepartments(deptsData);
            
            if (deptsData.length > 0 && !selectedDept) {
                setSelectedDept(deptsData[0].id);
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
            await apiClient.post('/api/positions', {
                title: newTitle,
                department_id: selectedDept,
            });
            fetchData(); 
            setNewTitle('');
        } catch (err) {
            setFormError('An error occurred.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    // (The JSX remains the same)
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 2, paddingRight: '20px' }}>
                <h2>Job Positions</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Title</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((pos) => (
                            <tr key={pos.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{pos.title}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {pos.department ? pos.department.name : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ flex: 1 }}>
                <h3>Create New Position</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Position Title:</label>
                        <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Department (Optional):</label>
                        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} style={{ width: '100%' }}>
                            <option value="">-- All Departments --</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    <button type="submit" style={{ width: '100%' }}>Create Position</button>
                </form>
            </div>
        </div>
    );
};

export default PositionsPage;