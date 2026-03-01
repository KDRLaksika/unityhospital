import { Pill, AlertTriangle, Plus } from 'lucide-react';

const AdminPharmacy = () => {
    const inventory = [
        { id: 'MED-001', name: 'Paracetamol 500mg', type: 'Tablet', stock: 1200, status: 'In Stock' },
        { id: 'MED-002', name: 'Amoxicillin 250mg', type: 'Capsule', stock: 450, status: 'Low Stock' },
        { id: 'MED-003', name: 'Ibuprofen 400mg', type: 'Tablet', stock: 890, status: 'In Stock' },
        { id: 'MED-004', name: 'Cough Syrup 100ml', type: 'Syrup', stock: 12, status: 'Critical' },
    ];

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pharmacy Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage medicine stock and supplier orders.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-md font-medium shadow-btn transition-colors">
                    <Plus className="w-5 h-5" />
                    Add Medicine
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden flex-1 mt-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Item Code</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Medicine Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Current Stock</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {inventory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <Pill className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-900">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{item.type}</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">{item.stock} Units</td>
                                    <td className="px-6 py-4 text-center">
                                        {item.status === 'Critical' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                <AlertTriangle className="w-3 h-3" /> Critical
                                            </span>
                                        ) : (
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {item.status}
                                            </span>
                                        )}
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

export default AdminPharmacy;
