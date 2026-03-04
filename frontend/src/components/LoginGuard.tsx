import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * LoginGuard — wraps the /admin/login route.
 * If the user is already authenticated, immediately redirects them to the dashboard
 * so they cannot land on the login page while logged in.
 */
const LoginGuard = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

export default LoginGuard;
