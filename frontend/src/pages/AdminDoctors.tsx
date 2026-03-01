import { Search, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const AdminDoctors = () => {
    // Mock Data
    const doctors = [
        { id: 1, name: 'Dr. Sarah Wilson', spec: 'Cardiologist', slmc: 'SLMC-4921', phone: '+94 77 123 4567', status: 'Active' },
        { id: 2, name: 'Dr. James Perera', spec: 'Neurologist', slmc: 'SLMC-8832', phone: '+94 71 987 6543', status: 'Active' },
        { id: 3, name: 'Dr. Emily Chen', spec: 'Pediatrician', slmc: 'SLMC-5510', phone: '+94 70 555 1234', status: 'Inactive' },
        { id: 4, name: 'Dr. Nuwan Silva', spec: 'Orthopedic', slmc: 'SLMC-2294', phone: '+94 77 000 9999', status: 'Active' },
    ];

    return (
        <div className="space-y-6 flex flex-col h-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Doctors Management</h1>
                    <p className="text-gray-500 mt-1">Manage hospital doctors and their access credentials.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-md font-medium shadow-btn transition-colors">
                    <Plus className="w-5 h-5" />
                    Add New Doctor
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-card border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 focus:bg-white text-sm"
                        placeholder="Search doctors by name or SLMC number..."
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                        <option>All Specialties</option>
                        <option>Cardiology</option>
                        <option>Neurology</option>
                    </select>
                    <select className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Doctor Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Specialty</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">SLMC Reg No.</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {doctors.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                                                {doc.name.charAt(4)}
                                            </div>
                                            <span className="font-medium text-gray-900">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{doc.spec}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{doc.slmc}</td>
                                    <td className="px-6 py-4 text-gray-600">{doc.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${doc.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="text-gray-400 hover:text-primary-600 transition-colors p-1" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
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

export default AdminDoctors;
