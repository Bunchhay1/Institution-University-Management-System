import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

// --- NEW Mini-Component for adding components ---
const AddComponentForm = ({ templateId, fetchData }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('allowance');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // This calls our new API: /api/salary-templates/{id}/pay-components
            await apiClient.post(`/api/salary-templates/${templateId}/pay-components`, {
                name,
                amount,
                type,
                is_percentage: false, // We can add this feature later
            });
            
            fetchData(); // Refresh the main list
            setName('');
            setAmount('');
        } catch (err) {
            setError('Failed to add component.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input
                type="text"
                placeholder="Component Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ flex: 2 }}
            />
            <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{ flex: 1 }}
            />
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1 }}>
                <option value="allowance">Allowance</option>
                <option value="deduction">Deduction</option>
            </select>
            <button type="submit" style={{ flex: 1 }}>Add</button>
            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
        </form>
    );
};
// --- End of new mini-component ---


// --- Main Page Component (Updated) ---
const SalaryTemplatesPage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [newName, setNewName] = useState('');
    const [newBaseSalary, setNewBaseSalary] = useState('');
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        setLoading(true); // Set loading true on re-fetch
        try {
            const response = await apiClient.get('/api/salary-templates');
            setTemplates(Array.isArray(response.data) ? response.data : []);
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
            await apiClient.post('/api/salary-templates', {
                name: newName,
                base_salary: newBaseSalary,
            });
            fetchData(); // Refresh list
            setNewName('');
            setNewBaseSalary('');
        } catch (err) {
            setFormError('An error occurred.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ display: 'flex' }}>
            {/* Column 1: Template List */}
            <div style={{ flex: 2, paddingRight: '20px' }}>
                <h2>Salary Templates</h2>
                {templates.map((template) => (
                    <div key={template.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px' }}>
                        <h3>{template.name}</h3>
                        <p>Base Salary: ${parseFloat(template.base_salary).toFixed(2)}</p>
                        
                        {/* --- UPDATED SECTION --- */}
                        <strong>Components (Allowances/Deductions):</strong>
                        <ul style={{ listStyle: 'none', paddingLeft: '10px', margin: '10px 0' }}>
                            {template.pay_components.map((comp) => (
                                <li key={comp.id} style={{ color: comp.type === 'allowance' ? 'green' : 'red' }}>
                                    {comp.name}: ${parseFloat(comp.amount).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                        
                        {/* --- ADDED THE NEW FORM --- */}
                        <AddComponentForm templateId={template.id} fetchData={fetchData} />
                    </div>
                ))}
            </div>

            {/* Column 2: Create New Form */}
            <div style={{ flex: 1 }}>
                <h3>Create New Template</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Template Name:</label>
                        <input
                            type="text"
                            placeholder="e.g., Faculty Grade 1"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Base Salary (Monthly):</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="e.g., 3000.00"
                            value={newBaseSalary}
                            onChange={(e) => setNewBaseSalary(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    <button type="submit" style={{ width: '100%' }}>
                        Create Template
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SalaryTemplatesPage;