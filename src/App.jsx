import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import Home from './pages/student/Home';
import ReportLost from './pages/student/ReportLost';
import SubmitFound from './pages/student/SubmitFound';
import MyReports from './pages/student/MyReports';
import Notifications from './pages/student/Notifications';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import ManageItems from './pages/admin/ManageItems';
import ManageClaims from './pages/admin/ManageClaims';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  const { currentUser } = useAuth();

  // If not logged in, only show auth pages
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Common wrapper layout (Navbar / Sidebar)
  return (
    <Layout role={currentUser.role}>
      <Routes>
        {currentUser.role === 'student' ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/report-lost" element={<ReportLost />} />
            <Route path="/submit-found" element={<SubmitFound />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/manage-items" element={<ManageItems />} />
            <Route path="/manage-claims" element={<ManageClaims />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Layout>
  );
}

export default App;
