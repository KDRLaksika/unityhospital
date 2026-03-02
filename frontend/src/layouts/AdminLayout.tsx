import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Users,
    Stethoscope,
    CalendarDays,
    Pill,
    Building2,
    LayoutDashboard,
    LogOut,
    Receipt,
    Moon,
    Sun
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const sidebarLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
        { name: 'Patients', path: '/admin/patients', icon: Users },
        { name: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
        { name: 'Billing', path: '/admin/billing', icon: Receipt },
        { name: 'Hospital', path: '/admin/hospital', icon: Building2 },
        { name: 'Pharmacy', path: '/admin/pharmacy', icon: Pill },
    ];

    return (
        <div className="flex h-screen bg-background dark:bg-dark-bg transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-dark-card shadow-card flex flex-col z-10 transition-colors duration-200 border-r border-transparent dark:border-dark-border">
                <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-dark-border px-6">
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-500 font-bold text-xl tracking-tight">
                        <Building2 className="h-6 w-6" />
                        <span>UnityHospital</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border/50 hover:text-gray-900 dark:hover:text-gray-200'
                                }`
                            }
                        >
                            <link.icon className="h-5 w-5" />
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-dark-border">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-dark-card shadow-sm flex items-center justify-between px-8 z-0 relative transition-colors duration-200 border-b border-transparent dark:border-dark-border">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">Admin Portal</h2>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 mr-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border transition-colors focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Admin Profile simple indicator */}
                        <div className="flex items-center gap-3 border-l pl-4 border-gray-200 dark:border-dark-border">
                            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-sm uppercase">
                                {user?.email ? user.email.charAt(0) : 'A'}
                            </div>
                            <div className="hidden md:block text-sm">
                                <p className="font-medium text-gray-800 dark:text-gray-200 leading-tight">System {user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()) : 'Admin'}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.email || 'admin_unity'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
