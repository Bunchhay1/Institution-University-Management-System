import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const FacultyGradingPage = () => {
    const [sections, setSections] = useState([]);
    const [roster, setRoster] = useState([]); // Students in the selected section
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedSection, setSelectedSection] = useState('');
    // This object will hold the grades, e.g., { 1: "A-", 2: "B+" }
    const [grades, setGrades] = useState({});

    // --- 1. Fetch all sections ---
    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await apiClient.get('/api/sections');
                const sectionsData = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setSections(sectionsData);
                
                if (sectionsData.length > 0) {
                    setSelectedSection(sectionsData[0].id);
                }
            } catch (err) {
                setError('Failed to fetch sections.');
            }
            setLoading(false);
        };
        fetchSections();
    }, []);

    // --- 2. Fetch the roster when a section is selected ---
    useEffect(() => {
        if (!selectedSection) return;

        const fetchRoster = async () => {
            try {
                const res = await apiClient.get(`/api/sections/${selectedSection}/enrollments`);
                const rosterData = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setRoster(rosterData);
                
                // Load existing grades into the state
                let initialGrades = {};
                rosterData.forEach(enrollment => {
                    initialGrades[enrollment.id] = enrollment.grade || ''; // Use enrollment ID as key
                });
                setGrades(initialGrades);
                
            } catch (err) {
                setError('Failed to fetch student roster.');
            }
        };
        fetchRoster();
    }, [selectedSection]); // Re-run when selectedSection changes

    // --- 3. Handle changing a grade in an input box ---
    const handleGradeChange = (enrollmentId, newGrade) => {
        setGrades(prev => ({
            ...prev,
            [enrollmentId]: newGrade
        }));
    };

    // --- 4. Handle saving a single student's grade ---
    const handleSaveGrade = async (enrollmentId) => {
        const grade = grades[enrollmentId];
        if (grade === '') {
            alert('Please enter a grade to save.');
            return;
        }

        try {
            // Call our new API endpoint
            await apiClient.post(`/api/enrollments/${enrollmentId}/grade`, { grade: grade });
            alert('Grade saved successfully!');
            // We can also refresh the roster to show the "completed" status
            const res = await apiClient.get(`/api/sections/${selectedSection}/enrollments`);
            setRoster(Array.isArray(res.data) ? res.data : (res.data.data || []));
        } catch (err) {
            alert('Failed to save grade.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Faculty Gradebook</h2>
            
            {/* --- Section Selector --- */}
            <div style={{ marginBottom: '20px' }}>
                <label>Select Section to Grade:</label>
                <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    style={{ width: '300px' }}
                >
                    {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.course.code} - {section.course.title} ({section.term})
                        </option>
                    ))}
                </select>
            </div>

            {/* --- Grading Sheet --- */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Student Name</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', width: '100px' }}>Grade</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', width: '100px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {roster.map((enrollment) => (
                        <tr key={enrollment.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                {enrollment.student.person.first_name} {enrollment.student.person.last_name}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textTransform: 'capitalize' }}>
                                {enrollment.status}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="text"
                                    placeholder="e.g., A-"
                                    value={grades[enrollment.id] || ''}
                                    onChange={(e) => handleGradeChange(enrollment.id, e.target.value)}
                                    style={{ width: '100%' }}
                                    disabled={enrollment.status === 'completed'}
                                />
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                {enrollment.status !== 'completed' && (
                                    <button 
                                        onClick={() => handleSaveGrade(enrollment.id)}
                                        style={{ width: '100%' }}
                                    >
                                        Save
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FacultyGradingPage;