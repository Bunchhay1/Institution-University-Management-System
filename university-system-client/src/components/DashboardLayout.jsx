import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// (All the 'styles' code is the same)
const styles = {
    layout: { display: 'flex' },
    sidebar: {
        width: '220px',
        minHeight: '100vh',
        background: '#f4f4f4',
        padding: '20px',
        borderRight: '1px solid #ddd',
    },
    content: {
        flex: 1,
        padding: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nav: {
        listStyle: 'none',
        padding: 0,
    },
    navItem: {
        marginBottom: '10px',
    },
};

const DashboardLayout = () => {
    const { user, logout } = useAuth();

    // --- THIS IS THE FIX ---
    // We safely check if user and user.person exist.
    // If they don't, we default to 'isStudent = false'.
    const isStudent = user && user.person ? (user.person.type === 'student' || user.person.type === 'both') : false;

    // This prevents a crash if the user somehow gets here without a name
    const userName = user ? user.name : 'User';

    return (
        <div style={styles.layout}>
            {/* --- 1. SIDEBAR --- */}
            <aside style={styles.sidebar}>
                <h3>University System</h3>
                <p>Welcome, {userName}!</p>
                
                <ul style={styles.nav}>
                    {/* --- Student-only links --- */}
                    {isStudent && (
                        <li style={styles.navItem}>
                            <Link to="/my-dashboard">My Dashboard</Link>
                        </li>
                    )}

                    {/* --- Admin-only links --- */}
                    {!isStudent && (
                        <>
                            <li style={styles.navItem}>
                                <Link to="/">Dashboard</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/people">People</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/departments">Departments</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/positions">Positions</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/programs">Programs</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/courses">Courses</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/sections">Sections</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/enrollment">Student Enrollment</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/gradebook">Faculty Gradebook</Link>
                            </li>
                            <li style={{...styles.navItem, marginTop: '10px'}}>
                                <Link to="/salary-templates">Salary Templates</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/payroll">Payroll</Link>
                            </li>
                            <li style={{...styles.navItem, marginTop: '10px'}}>
                                <Link to="/leave-requests">Leave Requests</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/timesheets">Timesheets</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/student-attendance">Student Attendance</Link>
                            </li>
                            <li style={{...styles.navItem, marginTop: '10px'}}>
                                <Link to="/billing">Billing & Finance</Link>
                            </li>
                        </>
                    )}
                </ul>
                <button onClick={logout}>Logout</button>
            </aside>

            {/* --- 2. MAIN CONTENT --- */}
            <main style={styles.content}>
                <header style={styles.header}>
                    <h1>Main Content</h1>
                </header>
                
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;