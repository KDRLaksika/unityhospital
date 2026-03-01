import { Building2, Settings2, DoorOpen, Bed } from 'lucide-react';

const AdminHospital = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hospital Infrastructure</h1>
                    <p className="text-gray-500 mt-1">Manage departments, wards, and physical assets.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-card border border-primary-200 cursor-pointer hover:bg-primary-50 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                        <Building2 className="w-6 h-6 text-primary-700" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Departments</h3>
                    <p className="text-sm text-gray-500">Manage 12 clinical & non-clinical departments.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100 cursor-pointer hover:border-primary-200 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <DoorOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Wards & Rooms</h3>
                    <p className="text-sm text-gray-500">Configure 42 active rooms and ICUs.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100 cursor-pointer hover:border-primary-200 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <Bed className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Bed Management</h3>
                    <p className="text-sm text-gray-500">Real-time occupancy tracking for 150 beds.</p>
                </div>
            </div>

            {/* Settings Panel Mock */}
            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6 mt-6">
                <div className="flex items-center gap-3 mb-6">
                    <Settings2 className="w-6 h-6 text-gray-400" />
                    <h2 className="text-lg font-bold text-gray-900">General Settings</h2>
                </div>

                <div className="max-w-xl space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 md:text-sm"
                            defaultValue="Unity Hospital Central"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Contact Hotline</label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 md:text-sm"
                            defaultValue="+94 11 234 5678"
                        />
                    </div>
                    <div className="pt-2">
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHospital;
