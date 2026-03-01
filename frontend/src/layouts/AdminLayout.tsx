import { Outlet, NavLink } from 'react-router-dom';
import {
    Users,
    Stethoscope,
    CalendarDays,
    Pill,
    Building2,
    LayoutDashboard,
    LogOut,
    Receipt
} from 'lucide-react';

const AdminLayout = () => {
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
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-card flex flex-col z-10 transition-all duration-300">
                <div className="h-16 flex items-center justify-center border-b border-gray-100 px-6">
                    <div className="flex items-center gap-2 text-primary-600 font-bold text-xl tracking-tight">
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
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <link.icon className="h-5 w-5" />
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-0 relative">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Admin Portal</h2>

                    <div className="flex items-center gap-4">
                        {/* Admin Profile simple indicator */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                                A
                            </div>
                            <div className="hidden md:block text-sm">
                                <p className="font-medium text-gray-800 leading-tight">System Admin</p>
                                <p className="text-gray-500 text-xs">admin_unity</p>
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
