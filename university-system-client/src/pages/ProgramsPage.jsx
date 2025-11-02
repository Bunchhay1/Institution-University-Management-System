import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const ProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        try {
            const [programsRes, deptsRes] = await Promise.all([
                apiClient.get('/api/programs'),
                apiClient.get('/api/departments')
            ]);
            
            // --- THIS IS THE FIX ---
            // We check if the data is paginated (has a .data property) or a simple array
            const programsData = Array.isArray(programsRes.data) ? programsRes.data : (programsRes.data.data || []);
            const deptsData = Array.isArray(deptsRes.data) ? deptsRes.data : (deptsRes.data.data || []);

            setPrograms(programsData);
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
            await apiClient.post('/api/programs', {
                name: newName,
                department_id: selectedDept,
            });
            fetchData(); 
            setNewName('');
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
                <h2>Academic Programs</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Program Name</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Managing Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map((program) => (
                            <tr key={program.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{program.name}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {program.department ? program.department.name : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ flex: 1 }}>
                <h3>Create New Program</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Program Name:</label>
                        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Managing Department:</label>
                        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} required style={{ width: '100%' }}>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    <button type="submit" style={{ width: '100%' }}>Create</button>
                </form>
            </div>
        </div>
    );
};

export default ProgramsPage;