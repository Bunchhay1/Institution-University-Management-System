import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';
import { Link } from 'react-router-dom';

// --- A Reusable Stat Card Component ---
const StatCard = ({ title, value, linkTo }) => (
    <div style={{ 
        flex: 1, 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        background: 'white' 
    }}>
        <h3 style={{ margin: 0, color: '#555' }}>{title}</h3>
        <p style={{ fontSize: '36px', margin: '10px 0' }}>{value}</p>
        <Link to={linkTo}>View details &rarr;</Link>
    </div>
);

// --- The Main Dashboard Page ---
const DashboardHomePage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/api/dashboard-stats');
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Dashboard Overview</h2>
            
            {/* --- Stat Card Container --- */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <StatCard 
                    title="Total Students" 
                    value={stats.total_students} 
                    linkTo="/people" 
                />
                <StatCard 
                    title="Total Staff" 
                    value={stats.total_staff} 
                    linkTo="/people" 
                />
                <StatCard 
                    title="Active Courses" 
                    value={stats.total_courses} 
                    linkTo="/courses" 
                />
                <StatCard 
                    title="Active Sections" 
                    value={stats.total_sections} 
                    linkTo="/sections" 
                />
            </div>

            {/* We can add more dashboard components here later (e.g., charts) */}
        </div>
    );
};

export default DashboardHomePage;