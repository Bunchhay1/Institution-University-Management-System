import { useAuth } from './context/AuthContext.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardHomePage from './pages/DashboardHomePage.jsx';

// --- Import All Our Pages ---
import FacultyGradingPage from './pages/FacultyGradingPage.jsx';
import BillingPage from './pages/BillingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import PeopleList from './pages/PeopleList.jsx';
import DepartmentsPage from './pages/DepartmentsPage.jsx';
import PositionsPage from './pages/PositionsPage.jsx';
import ProgramsPage from './pages/ProgramsPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import SectionsPage from './pages/SectionsPage.jsx';
import EnrollmentPage from './pages/EnrollmentPage.jsx';
import SalaryTemplatesPage from './pages/SalaryTemplatesPage.jsx';
import PayrollPage from './pages/PayrollPage.jsx';
import PayrollRunDetailPage from './pages/PayrollRunDetailPage.jsx';
import LeaveRequestsPage from './pages/LeaveRequestsPage.jsx';
import TimesheetsPage from './pages/TimesheetsPage.jsx';
import StudentAttendancePage from './pages/StudentAttendancePage.jsx';
import PayslipDetailPage from './pages/PayslipDetailPage.jsx';
import StudentDashboardPage from './pages/StudentDashboardPage.jsx';
// A simple component for the dashboard homepage
// A simple component for the dashboard homepage
const DashboardHome = () => <h2>Dashboard Home</h2>;

function App() {
  const { user } = useAuth();

  // This is our protected route layout
  const ProtectedLayout = () => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return <DashboardLayout />;
  };

  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />

      {/* --- Protected Routes (Inside the Dashboard) --- */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<DashboardHome />} />
        <Route index element={<DashboardHomePage />} />
        
        {/* HR */}
        <Route path="people" element={<PeopleList />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="positions" element={<PositionsPage />} />
        
        {/* Academic */}
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="sections" element={<SectionsPage />} />
        <Route path="enrollment" element={<EnrollmentPage />} />
        
        {/* Payroll */}
        <Route path="salary-templates" element={<SalaryTemplatesPage />} />
        <Route path="payroll/:id" element={<PayrollRunDetailPage />} />
        <Route path="payroll" element={<PayrollPage />} />
        <Route path="payroll/:id" element={<PayrollRunDetailPage />} />
        {/* Attendance */}
        <Route path="leave-requests" element={<LeaveRequestsPage />} />
        <Route path="timesheets" element={<TimesheetsPage />} />
        <Route path="student-attendance" element={<StudentAttendancePage />} />
    {/* ------------------------- */}{/* --- ADD THIS NEW ROUTE --- */}
    {/* --- ADD THIS NEW ROUTE --- */}
    <Route path="gradebook" element={<FacultyGradingPage />} />
    <Route path="my-dashboard" element={<StudentDashboardPage />} />
    <Route path="billing" element={<BillingPage />} />
    
    {/* ------------------------- */}
      </Route>

      {/* --- Catch-all 404 Page --- */}
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    </Routes>
  );
}

export default App;