import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes — any authenticated user */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="settings" element={<AdminSettings />} />

            {/* Admin-only routes — STAFF gets redirected to dashboard */}
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="billing" element={<AdminBilling />} />
              <Route path="hospital" element={<AdminHospital />} />
              <Route path="pharmacy" element={<AdminPharmacy />} />
              <Route path="staff" element={<AdminStaff />} />
            </Route>
          </Route>
        </Route>

        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
