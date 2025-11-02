import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const StudentDashboardPage = () => {
    const [myData, setMyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/api/my-dashboard');
                setMyData(response.data);
            } catch (err) {
                setError('Failed to fetch student data.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading my dashboard...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!myData) return <p>No student data found.</p>;

    return (
        <div>
            <h2>My Dashboard</h2>
            <p>Welcome, {myData.person.first_name}!</p>
            <p>Enrollment ID: {myData.enrollment_no}</p>
            
            <hr style={{ margin: '20px 0' }} />

            {/* --- My Grades & Courses --- */}
            <h3>My Grades</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Course</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Section Term</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {myData.enrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                {enrollment.section.course.code} - {enrollment.section.course.title}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                {enrollment.section.term}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <strong>{enrollment.grade || 'In Progress'}</strong>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr style={{ margin: '20px 0' }} />

            {/* --- My Attendance --- */}
            <h3>My Attendance</h3>
             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Course</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Date</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {myData.attendance_records.map((record) => (
                        <tr key={record.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                {record.section.course.code}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                {record.date}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', color: record.status === 'absent' ? 'red' : 'inherit' }}>
                                {record.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentDashboardPage;