import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/admin/login" replace />;
    }

    // Render the nested routes if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
