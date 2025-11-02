import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

// --- StaffForm Component (Updated) ---
const StaffForm = ({ departments, positions, templates, onCreated }) => {
    const [formError, setFormError] = useState(null);
    const [formState, setFormState] = useState({
        first_name: '', last_name: '', email: '',
        password: '', password_confirmation: '',
        type: 'staff', employee_no: '',
        join_date: new Date().toISOString().split('T')[0],
        contract_type: 'full-time',
        department_id: departments[0]?.id || '',
        position_id: positions[0]?.id || '',
        salary_template_id: templates[0]?.id || '', // <-- ADDED THIS
    });

    // This effect updates the default template ID when templates load
    useEffect(() => {
        if (templates.length > 0 && !formState.salary_template_id) {
            setFormState(prev => ({ ...prev, salary_template_id: templates[0].id }));
        }
    }, [templates]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        if (formState.password !== formState.password_confirmation) {
            setFormError('Passwords do not match.');
            return;
        }
        try {
            await apiClient.post('/api/people', formState);
            onCreated(); // Tell the parent to refresh
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).map(msg => msg[0]);
                setFormError(errorMessages.join(' '));
            } else {
                setFormError('An error occurred.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ... (first_name, last_name, email, password, confirm_password) ... */}
            <input type="hidden" name="type" value="staff" />
            <div style={{ marginBottom: '10px' }}><label>First Name:</label><input type="text" name="first_name" value={formState.first_name} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Last Name:</label><input type="text" name="last_name" value={formState.last_name} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Email:</label><input type="email" name="email" value={formState.email} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Password:</label><input type="password" name="password" value={formState.password} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Confirm Password:</label><input type="password" name="password_confirmation" value={formState.password_confirmation} onChange={handleInputChange} required style={{ width: '100%' }} /></div>

            <hr style={{ margin: '20px 0' }} />
            
            {/* ... (employee_no, join_date, contract_type, department, position) ... */}
            <div style={{ marginBottom: '10px' }}><label>Employee ID #:</label><input type="text" name="employee_no" value={formState.employee_no} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Join Date:</label><input type="date" name="join_date" value={formState.join_date} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Contract Type:</label><select name="contract_type" value={formState.contract_type} onChange={handleInputChange} style={{ width: '100%' }}><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="temporary">Temporary</option><option value="student-worker">Student-worker</option></select></div>
            <div style={{ marginBottom: '10px' }}><label>Department:</label><select name="department_id" value={formState.department_id} onChange={handleInputChange} required style={{ width: '100%' }}>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
            <div style={{ marginBottom: '10px' }}><label>Position:</label><select name="position_id" value={formState.position_id} onChange={handleInputChange} required style={{ width: '100%' }}>{positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
            
            {/* --- THIS IS THE NEW DROPDOWN --- */}
            <div style={{ marginBottom: '10px' }}>
                <label>Salary Template:</label>
                <select name="salary_template_id" value={formState.salary_template_id} onChange={handleInputChange} required style={{ width: '100%' }}>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name} (${t.base_salary})</option>)}
                </select>
            </div>
            {/* ------------------------------- */}
            
            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            <button type="submit" style={{ width: '100%' }}>Create Staff Member</button>
        </form>
    );
};

// --- StudentForm Component (Unchanged) ---
const StudentForm = ({ programs, onCreated }) => {
    // (This component code is exactly the same as before)
    const [formError, setFormError] = useState(null);
    const [formState, setFormState] = useState({
        first_name: '', last_name: '', email: '',
        password: '', password_confirmation: '',
        type: 'student', enrollment_no: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        program_id: programs[0]?.id || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        if (formState.password !== formState.password_confirmation) {
            setFormError('Passwords do not match.');
            return;
        }
        try {
            await apiClient.post('/api/people', formState);
            onCreated();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).map(msg => msg[0]);
                setFormError(errorMessages.join(' '));
            } else {
                setFormError('An error occurred.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="type" value="student" />
            <div style={{ marginBottom: '10px' }}><label>First Name:</label><input type="text" name="first_name" value={formState.first_name} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Last Name:</label><input type="text" name="last_name" value={formState.last_name} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Email:</label><input type="email" name="email" value={formState.email} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Password:</label><input type="password" name="password" value={formState.password} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Confirm Password:</label><input type="password" name="password_confirmation" value={formState.password_confirmation} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <hr style={{ margin: '20px 0' }} />
            <div style={{ marginBottom: '10px' }}><label>Enrollment ID #:</label><input type="text" name="enrollment_no" value={formState.enrollment_no} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Enrollment Date:</label><input type="date" name="enrollment_date" value={formState.enrollment_date} onChange={handleInputChange} required style={{ width: '100%' }} /></div>
            <div style={{ marginBottom: '10px' }}><label>Program:</label><select name="program_id" value={formState.program_id} onChange={handleInputChange} required style={{ width: '100%' }}>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            <button type="submit" style={{ width: '100%' }}>Create Student</button>
        </form>
    );
};


// --- Main Page Component (Updated) ---
const PeopleList = () => {
    const [people, setPeople] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [templates, setTemplates] = useState([]); // <-- ADDED THIS
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('staff'); 

    const fetchData = async () => {
        try {
            // --- UPDATED TO FETCH 5 APIS ---
            const [peopleRes, deptsRes, posRes, progRes, tplRes] = await Promise.all([
                apiClient.get('/api/people'),
                apiClient.get('/api/departments'),
                apiClient.get('/api/positions'),
                apiClient.get('/api/programs'),
                apiClient.get('/api/salary-templates') // <-- ADDED THIS
            ]);
            
            setPeople(Array.isArray(peopleRes.data) ? peopleRes.data : []);
            setDepartments(Array.isArray(deptsRes.data) ? deptsRes.data : []);
            setPositions(Array.isArray(posRes.data) ? posRes.data : []);
            setPrograms(Array.isArray(progRes.data) ? progRes.data : []);
            setTemplates(Array.isArray(tplRes.data) ? tplRes.data : []); // <-- ADDED THIS

        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreation = () => {
        setLoading(true);
        fetchData(); // Refresh all data
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ display: 'flex' }}>
            {/* Column 1: People List */}
            <div style={{ flex: 3, paddingRight: '20px' }}>
                <h2>People Directory</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {people.map((person) => (
                            <tr key={person.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{person.first_name} {person.last_name}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{person.email}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{person.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Column 2: Create New Person Form */}
            <div style={{ flex: 1 }}>
                <h3>Create New Person</h3>
                {/* --- TAB SWITCHER --- */}
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <button onClick={() => setActiveTab('staff')} style={{ flex: 1, padding: '10px', background: activeTab === 'staff' ? '#ddd' : '#f4f4f4', border: '1px solid #ccc' }}>
                        Create Staff
                    </button>
                    <button onClick={() => setActiveTab('student')} style={{ flex: 1, padding: '10px', background: activeTab === 'student' ? '#ddd' : '#f4f4f4', border: '1px solid #ccc' }}>
                        Create Student
                    </button>
                </div>
                
                {/* --- RENDER THE ACTIVE FORM --- */}
                {activeTab === 'staff' ? (
                    <StaffForm departments={departments} positions={positions} templates={templates} onCreated={handleCreation} />
                ) : (
                    <StudentForm programs={programs} onCreated={handleCreation} />
                )}
            </div>
        </div>
    );
};

export default PeopleList;