import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Stethoscope, CalendarCheck, TrendingUp, Loader2 } from 'lucide-react';
import { doctorService } from '../api/doctorService';
import { patientService } from '../api/patientService';
import { appointmentService } from '../api/appointmentService';
import { billingService } from '../api/billingService';
import { pharmacyService } from '../api/pharmacyService';

const StatCard = ({ title, value, icon: Icon, trend }: { title: string, value: string, icon: React.ElementType, trend: string }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-card border border-gray-100 dark:border-dark-border flex items-center justify-between transition-colors">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {trend}
                </span>
            </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalDoctors: 0,
        activePatients: 0,
        todayAppointments: 0,
        pendingBills: 0
    });
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [docs, patients, appts, bills, drugs] = await Promise.all([
                doctorService.getAllDoctors(),
                patientService.getAllPatients(),
                appointmentService.getAllAppointments(),
                billingService.getAllInvoices({}),
                pharmacyService.getAllDrugs({})
            ]);

            // Map stats
            setStats({
                totalDoctors: docs.data?.totalElements || docs.data?.length || 0,
                activePatients: patients.data?.totalElements || patients.data?.length || 0,
                todayAppointments: appts.data?.totalElements || appts.data?.length || 0, // Should filter by today ideally
                pendingBills: bills.data?.items?.filter((b: any) => b.status === 'PENDING').length || 0
            });

            // Map recent appointments (last 4)
            const appointmentsList = appts.data?.items || [];
            setRecentAppointments(appointmentsList.slice(0, 10));

            // Map alerts (Low stock)
            const lowStockItems = drugs.data?.items?.filter((d: any) => (d.currentStock || 0) < 100) || [];
            const newAlerts = lowStockItems.map((item: any) => ({
                id: item.id,
                type: 'error',
                title: 'Low Pharmacy Stock',
                message: `${item.name} currently below minimum threshold (${item.currentStock || 0} units remaining).`
            }));
            setAlerts(newAlerts);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, System Admin.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Doctors" value={stats.totalDoctors.toString()} icon={Stethoscope} trend="+4.2%" />
                <StatCard title="Active Patients" value={stats.activePatients.toLocaleString()} icon={Users} trend="+12.5%" />
                <StatCard title="Today's Appointments" value={stats.todayAppointments.toString()} icon={CalendarCheck} trend="+8.1%" />
                <StatCard title="Pending Bills" value={stats.pendingBills.toString()} icon={TrendingUp} trend="-2.4%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">

                {/* ── Recent Appointments ── */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-gray-100 dark:border-dark-border overflow-hidden transition-colors flex flex-col">
                    {/* Fixed header */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-3">
                        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Recent Appointments</h2>
                        <span className="text-xs text-gray-400 font-medium">{recentAppointments.length} shown</span>
                    </div>

                    {/* Scrollable body — max 10 rows before scroll kicks in (~384px) */}
                    <div className="overflow-y-auto flex-1" style={{ maxHeight: '22rem', scrollbarWidth: 'thin' }}>
                        {recentAppointments.length === 0 ? (
                            <p className="text-sm text-gray-500 py-10 text-center">No recent appointments found.</p>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-dark-border">
                                {recentAppointments.map((apt) => (
                                    <div key={apt.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                                                {apt.patientName?.charAt(0) || 'P'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{apt.patientName || 'Anonymous'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{apt.departmentName || 'General Dept.'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-3">
                                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-200">{apt.appointmentTime || 'N/A'}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${apt.status === 'COMPLETED'
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {apt.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pinned footer button */}
                    <div className="border-t border-gray-100 dark:border-dark-border px-6 py-3">
                        <button
                            onClick={() => navigate('/admin/appointments')}
                            className="w-full py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-md transition-colors"
                        >
                            View All Appointments →
                        </button>
                    </div>
                </div>

                {/* ── System Alerts ── */}
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-gray-100 dark:border-dark-border overflow-hidden transition-colors flex flex-col">
                    {/* Fixed header */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-3">
                        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">System Alerts</h2>
                        {alerts.length > 0 && (
                            <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                                {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {/* Scrollable body */}
                    <div className="overflow-y-auto flex-1" style={{ maxHeight: '22rem', scrollbarWidth: 'thin' }}>
                        {alerts.length === 0 ? (
                            <p className="text-sm text-gray-500 py-10 text-center">✓ No critical system alerts.</p>
                        ) : (
                            <div className="px-6 py-3 space-y-3">
                                {alerts.slice(0, 10).map((alert) => (
                                    <div key={alert.id} className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex gap-3">
                                        <div className="mt-1.5 flex-shrink-0"><div className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400"></div></div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-red-800 dark:text-red-400">{alert.title}</p>
                                            <p className="text-xs text-red-600 dark:text-red-300 mt-0.5 leading-relaxed">{alert.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pinned footer button */}
                    <div className="border-t border-gray-100 dark:border-dark-border px-6 py-3">
                        <button
                            onClick={() => navigate('/admin/pharmacy')}
                            className="w-full py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-md transition-colors"
                        >
                            View Pharmacy Stock →
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
