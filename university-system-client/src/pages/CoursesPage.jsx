import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCode, setNewCode] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newCredits, setNewCredits] = useState(3);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        try {
            const [coursesRes, programsRes] = await Promise.all([
                apiClient.get('/api/courses'),
                apiClient.get('/api/programs')
            ]);
            
            // --- THIS IS THE FIX ---
            const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : (coursesRes.data.data || []);
            const programsData = Array.isArray(programsRes.data) ? programsRes.data : (programsRes.data.data || []);

            setCourses(coursesData);
            setPrograms(programsData);
            
            if (programsData.length > 0 && !selectedProgram) {
                setSelectedProgram(programsData[0].id);
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
            await apiClient.post('/api/courses', {
                code: newCode,
                title: newTitle,
                credits: newCredits,
                program_id: selectedProgram,
            });
            fetchData(); 
            setNewCode('');
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
            <div style={{ flex: 3, paddingRight: '20px' }}>
                <h2>Course Catalog</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Code</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Title</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Program</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{course.code}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{course.title}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {course.program ? course.program.name : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ flex: 1 }}>
                <h3>Create New Course</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Course Code:</label>
                        <input type="text" placeholder="e.g., CS101" value={newCode} onChange={(e) => setNewCode(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Course Title:</label>
                        <input type="text" placeholder="e.g., Intro to Programming" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Credits:</label>
                        <input type="number" value={newCredits} onChange={(e) => setNewCredits(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Program:</label>
                        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} required style={{ width: '100%' }}>
                            {programs.map((prog) => (
                                <option key={prog.id} value={prog.id}>{prog.name}</option>
                            ))}
                        </select>
                    </div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    <button type="submit" style={{ width: '100%' }}>Create Course</button>
                </form>
            </div>
        </div>
    );
};

export default CoursesPage;