import { Search, Plus, Filter, UserRound } from 'lucide-react';

const AdminPatients = () => {
    const patients = [
        { id: 'PAT-10492', name: 'Nimal Perera', age: 45, gender: 'Male', phone: '077 111 2222', registered: 'Oct 12, 2025' },
        { id: 'PAT-10493', name: 'Sunita Silva', age: 32, gender: 'Female', phone: '071 333 4444', registered: 'Oct 14, 2025' },
        { id: 'PAT-10494', name: 'Kamal Jayasinghe', age: 58, gender: 'Male', phone: '070 555 6666', registered: 'Nov 02, 2025' },
        { id: 'PAT-10495', name: 'Amaya Fernando', age: 24, gender: 'Female', phone: '075 777 8888', registered: 'Nov 15, 2025' },
    ];

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Directory</h1>
                    <p className="text-gray-500 mt-1">View and manage registered hospital patients.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-md font-medium shadow-btn transition-colors">
                    <Plus className="w-5 h-5" />
                    Add Patient
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-card border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 focus:bg-white text-sm"
                        placeholder="Search by Patient ID, Name, or Phone..."
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 font-medium text-sm transition-colors">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Patient ID</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Details</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Registered On</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {patients.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-primary-600 font-medium">{p.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                                <UserRound className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-900">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{p.age} yrs • {p.gender}</td>
                                    <td className="px-6 py-4 text-gray-600">{p.phone}</td>
                                    <td className="px-6 py-4 text-gray-500">{p.registered}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPatients;
