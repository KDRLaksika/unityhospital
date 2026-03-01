import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDoctors from './pages/AdminDoctors';
import AdminPatients from './pages/AdminPatients';
import AdminAppointments from './pages/AdminAppointments';
import AdminBilling from './pages/AdminBilling';
import AdminPharmacy from './pages/AdminPharmacy';
import AdminHospital from './pages/AdminHospital';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Placeholder Login Route */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Admin Routes wrapped in Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="billing" element={<AdminBilling />} />
          <Route path="hospital" element={<AdminHospital />} />
          <Route path="pharmacy" element={<AdminPharmacy />} />
          {/* We will add more nested routes here */}
        </Route>

        {/* Redirect root to admin dashboard for now */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
