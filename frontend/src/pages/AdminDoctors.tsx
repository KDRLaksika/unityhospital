import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2, RefreshCw, Save, UserRound } from 'lucide-react';
import { doctorService } from '../api/doctorService';
import Modal from '../components/Modal';

const EMPTY_FORM = {
    fullName: '',
    speciality: '',
    email: '',
    phone: '',
    slmcNo: '',
    isAvailable: true,
};

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<any>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    // Delete confirm
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const fetchDoctors = async (search: string = '') => {
        try {
            setLoading(true);
            setError('');
            const response = await doctorService.getAllDoctors({ search, page: 1, size: 100 });
            if (response.success && response.data?.items) {
                setDoctors(response.data.items);
            } else if (response.success && Array.isArray(response.data)) {
                setDoctors(response.data);
            } else {
                setDoctors([]);
            }
        } catch {
            setError('Could not load doctors data from the server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(() => fetchDoctors(searchTerm), 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const openAddModal = () => {
        setEditingDoctor(null);
        setForm({ ...EMPTY_FORM });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (doc: any) => {
        setEditingDoctor(doc);
        setForm({
            fullName: doc.fullName || '',
            speciality: doc.speciality || '',
            email: doc.email || '',
            phone: doc.phone || '',
            slmcNo: doc.slmcNo || '',
            isAvailable: doc.isAvailable ?? true,
        });
        setFormError('');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.fullName.trim() || !form.speciality.trim()) {
            setFormError('Full Name and Speciality are required.');
            return;
        }
        try {
            setSaving(true);
            setFormError('');
            if (editingDoctor) {
                await doctorService.updateDoctor(editingDoctor.id, form);
            } else {
                await doctorService.addDoctor(form);
            }
            setShowModal(false);
            fetchDoctors(searchTerm);
        } catch (err: any) {
            setFormError(err?.response?.data?.message || 'Failed to save doctor. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = (id: string) => {
        setDeletingId(id);
        setDeleteError('');
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            setDeleting(true);
            setDeleteError('');
            await doctorService.deleteDoctor(deletingId);
            setShowDeleteConfirm(false);
            setDeletingId(null);
            fetchDoctors(searchTerm);
        } catch (err: any) {
            setDeleteError(err?.response?.data?.message || 'Failed to delete. The server returned an error.');
        } finally {
            setDeleting(false);
        }
    };

    const inputClass = "block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200 transition-colors";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Doctors Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage hospital doctors and their credentials.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchDoctors(searchTerm)}
                        className="flex items-center justify-center p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-md font-medium shadow-btn transition-colors"
                    >
                        <Plus className="w-5 h-5" /> Add New Doctor
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-card border border-gray-100 dark:border-dark-border flex gap-4 items-center transition-colors">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        className={`${inputClass} pl-10`}
                        placeholder="Search by name, specialty, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-gray-100 dark:border-dark-border overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-dark-border/50 border-b border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Doctor Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Specialty</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">SLMC Reg No.</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-2" />Loading doctors...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-red-500">{error}</td></tr>
                            ) : doctors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 dark:bg-dark-border/30 rounded-full flex items-center justify-center">
                                                <UserRound className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No Doctors Found</h3>
                                                <p className="text-gray-500 dark:text-gray-400 mt-1">Click "Add New Doctor" to get started.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                doctors.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xs uppercase">
                                                    {doc.fullName?.charAt(0) ?? '?'}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-gray-200">{doc.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{doc.speciality || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{doc.slmcNo || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{doc.phone || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${doc.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {doc.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(doc)}
                                                    className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-1"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(doc.id)}
                                                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'} size="lg">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                            <input type="text" className={inputClass} placeholder="Dr. John Smith" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Speciality <span className="text-red-500">*</span></label>
                            <input type="text" className={inputClass} placeholder="e.g. Cardiology" value={form.speciality} onChange={(e) => setForm({ ...form, speciality: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input type="email" className={inputClass} placeholder="doctor@hospital.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input type="tel" className={inputClass} placeholder="077 123 4567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>SLMC Registration No.</label>
                            <input type="text" className={inputClass} placeholder="SLMC/0001" value={form.slmcNo} onChange={(e) => setForm({ ...form, slmcNo: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                                checked={form.isAvailable}
                                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                            />
                            <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 dark:text-gray-300">Available for appointments</label>
                        </div>
                    </div>

                    {formError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">{formError}</p>}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-border mt-4">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-md transition-colors"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : (editingDoctor ? 'Update Doctor' : 'Add Doctor')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setDeleteError(''); }} title="Confirm Delete" size="sm">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to delete this doctor? This action cannot be undone.</p>
                {deleteError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md mb-4">{deleteError}</p>}
                <div className="flex justify-end gap-3">
                    <button onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); }} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-md transition-colors">
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDoctors;
