import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const StudentAttendancePage = () => {
    const [sections, setSections] = useState([]);
    const [roster, setRoster] = useState([]); // The list of students in the selected section
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [selectedSection, setSelectedSection] = useState('');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    // This object will hold the status for each student
    const [attendanceData, setAttendanceData] = useState({});

    // --- 1. Fetch the list of sections (classes) ---
    const fetchSections = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/api/sections');
            const sectionsData = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setSections(sectionsData);
            
            if (sectionsData.length > 0) {
                // Automatically select the first section
                setSelectedSection(sectionsData[0].id);
            }
        } catch (err) {
            setError('Failed to fetch sections.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSections();
    }, []);

    // --- 2. Fetch the roster (student list) when a section is selected ---
    useEffect(() => {
        if (!selectedSection) return;

        const fetchRoster = async () => {
            try {
                // Get the list of enrollments (students) for this section
                const res = await apiClient.get(`/api/sections/${selectedSection}/enrollments`);
                const rosterData = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setRoster(rosterData);
                
                // Reset the attendance data
                let initialData = {};
                rosterData.forEach(enrollment => {
                    initialData[enrollment.student_profile.id] = 'present'; // Default to 'present'
                });
                setAttendanceData(initialData);
                
            } catch (err) {
                setError('Failed to fetch student roster.');
            }
        };

        fetchRoster();
    }, [selectedSection]); // Re-run this when selectedSection changes

    // --- 3. Handle changing a student's status ---
    const handleStatusChange = (studentProfileId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentProfileId]: status
        }));
    };

    // --- 4. Handle submitting the attendance sheet ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert our attendanceData object into the array the API expects
        const payload = {
            date: attendanceDate,
            attendances: Object.keys(attendanceData).map(studentId => ({
                student_profile_id: studentId,
                status: attendanceData[studentId],
            })),
        };

        try {
            await apiClient.post(`/api/sections/${selectedSection}/mark-attendance`, payload);
            alert('Attendance submitted successfully!');
        } catch (err) {
            alert('Failed to submit attendance.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Student Attendance</h2>
            
            {/* --- Section/Date Selector --- */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label>Select Section:</label>
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
                <div>
                    <label>Attendance Date:</label>
                    <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                    />
                </div>
            </div>

            {/* --- Attendance Sheet --- */}
            <form onSubmit={handleSubmit}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Student Name</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.map((enrollment) => (
                            <tr key={enrollment.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    {enrollment.student.person.first_name} {enrollment.student.person.last_name}
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    <select
                                        value={attendanceData[enrollment.student_profile.id] || 'present'}
                                        onChange={(e) => handleStatusChange(enrollment.student_profile.id, e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="present">Present</option>
                                        <option value="absent">Absent</option>
                                        <option value="late">Late</option>
                                        <option value="excused">Excused</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit" style={{ width: '100%', padding: '10px', marginTop: '20px', background: 'green', color: 'white' }}>
                    Submit Attendance
                </button>
            </form>
        </div>
    );
};

export default StudentAttendancePage;