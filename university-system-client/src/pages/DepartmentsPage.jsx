import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the "Create New" form
    const [newName, setNewName] = useState('');
    const [formError, setFormError] = useState(null);

    // --- 1. Function to Fetch All Departments ---
    const fetchDepartments = async () => {
        try {
            const { data } = await apiClient.get('/api/departments');
            
            // --- THIS IS THE FIX ---
            // Check if the data is paginated (has a .data property) or a simple array
            const deptsData = Array.isArray(data) ? data : (data.data || []);

            setDepartments(deptsData);
        } catch (err) {
            setError('Failed to fetch departments.');
            console.error(err);
        }
        setLoading(false);
    };

    // --- 2. Run fetchDepartments() on Page Load ---
    useEffect(() => {
        fetchDepartments();
    }, []); // Empty array means run only once

    // --- 3. Function to Handle Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        try {
            // Send the new department to the API
            await apiClient.post('/api/departments', {
                name: newName,
            });

            // If successful, refresh the list and clear the form
            fetchDepartments();
            setNewName('');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setFormError(err.response.data.errors.name[0]);
            } else {
                setFormError('An error occurred. Please try again.');
            }
        }
    };

    // --- 4. Render the Page ---
    if (loading) return <p>Loading departments...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ display: 'flex' }}>
            {/* Column 1: Department List */}
            <div style={{ flex: 2, paddingRight: '20px' }}>
                <h2>Departments</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{dept.id}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{dept.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Column 2: Create New Form */}
            <div style={{ flex: 1 }}>
                <h3>Create New Department</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Department Name:</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    <button type="submit" style={{ width: '100%' }}>
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DepartmentsPage;