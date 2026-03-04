import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginGuard from './components/LoginGuard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDoctors from './pages/AdminDoctors';
import AdminPatients from './pages/AdminPatients';
import AdminAppointments from './pages/AdminAppointments';
import AdminBilling from './pages/AdminBilling';
import AdminPharmacy from './pages/AdminPharmacy';
import AdminHospital from './pages/AdminHospital';
import AdminStaff from './pages/AdminStaff';
import AdminSettings from './pages/AdminSettings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page — auto-redirects to dashboard if already logged in */}
        <Route path="/admin/login" element={<LoginGuard />}>
          <Route index element={<AdminLogin />} />
        </Route>

        {/* All /admin/* routes — require authentication */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="hospital" element={<AdminHospital />} />
            <Route path="settings" element={<AdminSettings />} />

            {/* Admin-only — staff gets redirected to dashboard */}
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="billing" element={<AdminBilling />} />
              <Route path="pharmacy" element={<AdminPharmacy />} />
              <Route path="staff" element={<AdminStaff />} />
            </Route>
          </Route>
        </Route>

        {/* Root → /admin (ProtectedRoute handles redirect to login if unauthenticated) */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
