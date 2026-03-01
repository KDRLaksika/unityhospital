import { Users, Stethoscope, CalendarCheck, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {trend}
                </span>
            </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-600" />
        </div>
    </div>
);

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, System Admin.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Doctors" value="124" icon={Stethoscope} trend="+4.2%" />
                <StatCard title="Active Patients" value="2,845" icon={Users} trend="+12.5%" />
                <StatCard title="Today's Appointments" value="86" icon={CalendarCheck} trend="+8.1%" />
                <StatCard title="Pending Bills" value="24" icon={TrendingUp} trend="-2.4%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                {/* Recent Activity Mock */}
                <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Appointments</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                        P{i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Patient #{1000 + i}</p>
                                        <p className="text-xs text-gray-500">Cardiology Dept.</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">10:{i}0 AM</p>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-medium">Pending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors">
                        View All Appointments
                    </button>
                </div>

                {/* System Alerts Mock */}
                <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">System Alerts</h2>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex gap-3">
                            <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-red-500"></div></div>
                            <div>
                                <p className="text-sm font-semibold text-red-800">Low Pharmacy Stock</p>
                                <p className="text-xs text-red-600 mt-1">Paracetamol 500mg currently below minimum threshold (12 units remaining).</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100 flex gap-3">
                            <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div></div>
                            <div>
                                <p className="text-sm font-semibold text-yellow-800">Unassigned Doctor Slots</p>
                                <p className="text-xs text-yellow-700 mt-1">3 doctors have not submitted their availability for next week.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
