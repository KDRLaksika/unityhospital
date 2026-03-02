import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, Loader2, RefreshCw, Save, CalendarCheck } from 'lucide-react';
import { hospitalService } from '../api/hospitalService';
import Modal from '../components/Modal';

const EMPTY_FORM = { name: '', description: '', isActive: true };

const AdminHospital = () => {
    const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState<any>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    // Delete
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await hospitalService.getAllAppointmentTypes();
            if (response.success && response.data?.items) {
                setAppointmentTypes(response.data.items);
            } else if (response.success && Array.isArray(response.data)) {
                setAppointmentTypes(response.data);
            } else {
                setAppointmentTypes([]);
            }
        } catch {
            setError('Failed to load infrastructure data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openAddModal = () => {
        setEditingType(null);
        setForm({ ...EMPTY_FORM });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (type: any) => {
        setEditingType(type);
        setForm({ name: type.name || '', description: type.description || '', isActive: type.isActive ?? true });
        setFormError('');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) { setFormError('Type Name is required.'); return; }
        try {
            setSaving(true);
            setFormError('');
            if (editingType) {
                await hospitalService.updateAppointmentType(editingType.id, form);
            } else {
                await hospitalService.addAppointmentType(form);
            }
            setShowModal(false);
            fetchData();
        } catch (err: any) {
            setFormError(err?.response?.data?.message || 'Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = (id: string) => { setDeletingId(id); setShowDeleteConfirm(true); };
    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await hospitalService.deleteAppointmentType(deletingId);
            setShowDeleteConfirm(false);
            setDeletingId(null);
            fetchData();
        } catch { setShowDeleteConfirm(false); }
    };

    const inputClass = "block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200 transition-colors";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    const activeCount = appointmentTypes.filter(t => t.isActive !== false).length;
    const inactiveCount = appointmentTypes.filter(t => t.isActive === false).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Hospital Infrastructure</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage appointment types and clinical service categories.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2.5 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Summary Cards (real data) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-card border border-gray-100 dark:border-dark-border transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Appointment Types</h2>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{appointmentTypes.length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total service categories configured</p>
                </div>

                <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-card border border-gray-100 dark:border-dark-border transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <CalendarCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Active Types</h2>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Currently accepting appointments</p>
                </div>

                <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-card border border-gray-100 dark:border-dark-border transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Inactive Types</h2>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{inactiveCount}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Disabled or archived categories</p>
                </div>
            </div>

            {/* Appointment Types Table */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-gray-100 dark:border-dark-border transition-colors">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-border">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gray-400" /> Appointment Types
                    </h2>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add New Type
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-dark-border/50 border-b border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Type Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Description</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-2" />Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-red-500">{error}</td></tr>
                            ) : appointmentTypes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="w-16 h-16 bg-gray-50 dark:bg-dark-border/30 rounded-full flex items-center justify-center">
                                                <Building2 className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100">No Appointment Types</h3>
                                                <p className="text-gray-500 mt-1 text-sm">Click "Add New Type" to create the first category.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : appointmentTypes.map(type => (
                                <tr key={type.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{type.name}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{type.description || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${type.isActive !== false ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {type.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(type)} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-1" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => confirmDelete(type.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingType ? 'Edit Appointment Type' : 'Add Appointment Type'} size="md">
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Type Name <span className="text-red-500">*</span></label>
                        <input type="text" className={inputClass} placeholder="e.g. General Consultation" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea className={`${inputClass} resize-none`} rows={3} placeholder="Brief description of this appointment type..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    {editingType && (
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="typeIsActive" className="w-4 h-4 rounded text-primary-600 border-gray-300" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                            <label htmlFor="typeIsActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active (accepts appointments)</label>
                        </div>
                    )}

                    {formError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">{formError}</p>}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-border mt-4">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-md transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : (editingType ? 'Update' : 'Add Type')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm */}
            <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete" size="sm">
                <p className="text-gray-600 dark:text-gray-400 mb-6">Delete this appointment type? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">Delete</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminHospital;
