import { Download, Search, Filter, ReceiptText } from 'lucide-react';

const AdminBilling = () => {
    const bills = [
        { id: 'INV-2025-001', patient: 'Nimal Perera', amount: 'Rs. 4,500', date: 'Oct 12, 2025', status: 'Paid' },
        { id: 'INV-2025-002', patient: 'Sunita Silva', amount: 'Rs. 12,000', date: 'Oct 14, 2025', status: 'Pending' },
        { id: 'INV-2025-003', patient: 'Amaya Fernando', amount: 'Rs. 1,200', date: 'Nov 15, 2025', status: 'Paid' },
        { id: 'INV-2025-004', patient: 'Kamal Jayasinghe', amount: 'Rs. 35,000', date: 'Nov 02, 2025', status: 'Overdue' },
    ];

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Billing & Invoices</h1>
                    <p className="text-gray-500 mt-1">Manage hospital finances and patient billing.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md font-medium shadow-btn transition-colors">
                    <Download className="w-5 h-5" />
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue (Monthly)</p>
                    <h3 className="text-2xl font-bold text-gray-900">Rs. 452,000</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Pending Payments</p>
                    <h3 className="text-2xl font-bold text-yellow-600">Rs. 89,500</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Invoices Generated</p>
                    <h3 className="text-2xl font-bold text-gray-900">1,204</h3>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden flex-1 mt-6">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white text-sm"
                            placeholder="Search invoices..."
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-sm transition-colors">
                        <Filter className="w-4 h-4" /> Filter Status
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Invoice ID</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Patient</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Date Issued</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Amount</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bills.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-gray-900">
                                            <ReceiptText className="w-4 h-4 text-gray-400" />
                                            {b.id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{b.patient}</td>
                                    <td className="px-6 py-4 text-gray-500">{b.date}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{b.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${b.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                b.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm">
                                            View PDF
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

export default AdminBilling;
