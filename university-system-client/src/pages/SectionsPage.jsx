import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const SectionsPage = () => {
    const [sections, setSections] = useState([]);
    const [courses, setCourses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formCourse, setFormCourse] = useState('');
    const [formFaculty, setFormFaculty] = useState('');
    const [formTerm, setFormTerm] = useState('');
    const [formCapacity, setFormCapacity] = useState(50);
    const [formSchedule, setFormSchedule] = useState('');
    const [formError, setFormError] = useState(null);

    const fetchData = async () => {
        try {
            const [sectionsRes, coursesRes, facultyRes] = await Promise.all([
                apiClient.get('/api/sections'),
                apiClient.get('/api/courses'),
                apiClient.get('/api/faculty')
            ]);
            
            // --- THIS IS THE FIX ---
            const sectionsData = Array.isArray(sectionsRes.data) ? sectionsRes.data : (sectionsRes.data.data || []);
            const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : (coursesRes.data.data || []);
            const facultyData = Array.isArray(facultyRes.data) ? facultyRes.data : (facultyRes.data.data || []);

            setSections(sectionsData);
            setCourses(coursesData);
            setFaculty(facultyData);
            
            if (coursesData.length > 0 && !formCourse) {
                setFormCourse(coursesData[0].id);
            }
            if (facultyData.length > 0 && !formFaculty) {
                setFormFaculty(facultyData[0].id);
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
            await apiClient.post('/api/sections', {
                course_id: formCourse,
                faculty_id: formFaculty,
                term: formTerm,
                capacity: formCapacity,
                schedule: formSchedule,
            });
            fetchData();
            setFormTerm('');
            setFormSchedule('');
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
                <h2>Sections & Timetables</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Course</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Term</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Faculty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map((section) => (
                            <tr key={section.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {section.course ? section.course.title : 'N/A'}
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{section.term}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {section.faculty ? section.faculty.person.first_name + ' ' + section.faculty.person.last_name : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ flex: 1 }}>
                <h3>Create New Section</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Course:</label>
                        <select value={formCourse} onChange={(e) => setFormCourse(e.target.value)} required style={{ width: '100%' }}>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>{course.code} - {course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Faculty / Lecturer:</label>
                        <select value={formFaculty} onChange={(e) => setFormFaculty(e.target.value)} required style={{ width: '100%' }}>
                            {faculty.map((prof) => (
                                <option key={prof.id} value={prof.id}>{prof.person.first_name} {prof.person.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Term:</label>
                        <input type="text" placeholder="e.g., Fall 2025" value={formTerm} onChange={(e) => setFormTerm(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Schedule:</label>
                        <input type="text" placeholder="e.g., MWF 10:00-11:00" value={formSchedule} onChange={(e) => setFormSchedule(e.target.value)} style={{ width: '100%' }} />
                    </div>
                     <div style={{ marginBottom: '10px' }}>
                        <label>Capacity:</label>
                        <input type="number" value={formCapacity} onChange={(e) => setFormCapacity(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    <button type="submit" style={{ width: '100%' }}>Create Section</button>
                </form>
            </div>
        </div>
    );
};

export default SectionsPage;