import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const EnrollmentPage = () => {
    const [students, setStudents] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState('');

    const fetchData = async () => {
        try {
            const [studentRes, sectionRes] = await Promise.all([
                // We use our new filter to get ONLY students
                apiClient.get('/api/people?type=student'), 
                apiClient.get('/api/sections')
            ]);
            
            const studentData = Array.isArray(studentRes.data) ? studentRes.data : (studentRes.data.data || []);
            const sectionData = Array.isArray(sectionRes.data) ? sectionRes.data : (sectionRes.data.data || []);

            setStudents(studentData);
            setSections(sectionData);
            
            // Set defaults for dropdowns
            if (studentData.length > 0) {
                setSelectedStudent(studentData[0].student_profile.id); // Get the student *profile* ID
            }
            if (sectionData.length > 0) {
                setSelectedSection(sectionData[0].id);
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
        setFormSuccess('');

        if (!selectedStudent || !selectedSection) {
            setFormError('Please select a student and a section.');
            return;
        }

        try {
            // Call our new API endpoint: /api/sections/{id}/enroll
            await apiClient.post(`/api/sections/${selectedSection}/enroll`, {
                student_profile_id: selectedStudent,
            });
            
            setFormSuccess('Student enrolled successfully!');
            // You could refresh the lists here if needed
            
        } catch (err) {
            if (err.response && err.response.data.message) {
                setFormError(err.response.data.message); // Show error from server
            } else {
                setFormError('An error occurred.');
            }
            console.error(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Student Enrollment</h2>
            <div style={{ maxWidth: '500px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Select Student:</label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        >
                            {students.map((person) => (
                                // We use the student_profile.id for the value
                                <option key={person.id} value={person.student_profile.id}>
                                    {person.first_name} {person.last_name} (ID: {person.student_profile.enrollment_no})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Select Section:</label>
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        >
                            {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.course.code} - {section.course.title} ({section.term})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                    {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}
                    
                    <button type="submit" style={{ width: '100%' }}>
                        Enroll Student
                    </button>
                </form>
            </div>
            
            {/* We will add a list of enrolled students here later */}
        </div>
    );
};

export default EnrollmentPage;