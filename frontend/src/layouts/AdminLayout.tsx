import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import unityHospitalLogo from '../assets/images/unity-hospital-logo.png';

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
    Sun,
    UserCog,
    Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const AdminLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/admin/login');
        setShowLogoutModal(false);
    };

    // Links available to ALL authenticated users (ADMIN + STAFF)
    const commonLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
        { name: 'Patients', path: '/admin/patients', icon: Users },
        { name: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
        { name: 'Hospital', path: '/admin/hospital', icon: Building2 },
    ];

    // Links available ONLY to ADMIN
    const adminLinks = [
        { name: 'Billing', path: '/admin/billing', icon: Receipt },
        { name: 'Pharmacy', path: '/admin/pharmacy', icon: Pill },
        { name: 'Staff Management', path: '/admin/staff', icon: UserCog },
    ];

    const sidebarLinks = isAdmin ? [...commonLinks, ...adminLinks] : commonLinks;

    return (
        <div className="flex h-screen bg-background dark:bg-dark-bg transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-dark-card shadow-card flex flex-col z-10 transition-colors duration-200 border-r border-transparent dark:border-dark-border">
                <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-dark-border px-6">
                    <div className="flex items-center gap-3">
                        {/* Unity Hospital logo image */}
                        <img
                            src={unityHospitalLogo}
                            alt="Unity Hospital Logo"
                            className="w-9 h-9 object-contain flex-shrink-0"
                        />

                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-gray-900 dark:text-gray-100 text-base tracking-tight">Unity Hospital</span>
                            <span className="text-[10px] text-primary-500 font-semibold tracking-widest uppercase">Admin Portal</span>
                        </div>
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

                {/* Settings link + logout */}
                <div className="border-t border-gray-100 dark:border-dark-border p-3 space-y-1">
                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-colors ${isActive
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border/50 hover:text-gray-900 dark:hover:text-gray-200'
                            }`
                        }
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </NavLink>
                    <button
                        onClick={handleLogoutClick}
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
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">Admin Portal</h2>
                        {!isAdmin && (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Staff Access</span>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 mr-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-border transition-colors focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Admin Profile */}
                        <div className="flex items-center gap-3 border-l pl-4 border-gray-200 dark:border-dark-border">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm uppercase ${isAdmin ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                                {user?.email ? user.email.charAt(0) : 'U'}
                            </div>
                            <div className="hidden md:block text-sm">
                                <p className="font-medium text-gray-800 dark:text-gray-200 leading-tight">
                                    {isAdmin ? 'System Admin' : 'Staff Member'}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.email || ''}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Confirm Logout"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to log out of your account? You will need to sign in again to access the portal.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminLayout;
