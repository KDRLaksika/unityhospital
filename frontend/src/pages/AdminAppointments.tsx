import { Calendar as CalendarIcon, Clock, User, Stethoscope } from 'lucide-react';

const AdminAppointments = () => {
    const apts = [
        { id: 'APT-100', patient: 'Nimal Perera', doctor: 'Dr. Sarah Wilson', date: 'Today', time: '10:30 AM', status: 'Pending' },
        { id: 'APT-101', patient: 'Sunita Silva', doctor: 'Dr. James Perera', date: 'Today', time: '11:15 AM', status: 'In Progress' },
        { id: 'APT-102', patient: 'Kamal Jayasinghe', doctor: 'Dr. Nuwan Silva', date: 'Today', time: '09:00 AM', status: 'Completed' },
        { id: 'APT-103', patient: 'Amaya Fernando', doctor: 'Dr. Sarah Wilson', date: 'Tomorrow', time: '02:00 PM', status: 'Scheduled' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Scheduled': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Master Schedule</h1>
                    <p className="text-gray-500 mt-1">Cross-doctor appointment view.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {apts.map(apt => (
                    <div key={apt.id} className="bg-white p-5 rounded-xl shadow-card border border-gray-100 hover:border-primary-200 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                                {apt.status}
                            </span>
                            <span className="text-xs font-mono text-gray-400">{apt.id}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{apt.patient}</p>
                                    <p className="text-xs text-gray-500">Patient</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                    <Stethoscope className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{apt.doctor}</p>
                                    <p className="text-xs text-gray-500">Attending Doctor</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{apt.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium text-gray-900">{apt.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminAppointments;
