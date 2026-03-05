import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, UserRound, Loader2, RefreshCw, Save } from 'lucide-react';
import { patientService } from '../api/patientService';
import Modal from '../components/Modal';
import DateInput from '../components/DateInput';

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    nic: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    isActive: true,
};

const AdminPatients = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState<any>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    // Delete confirm
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const fetchPatients = async (search: string = '') => {
        try {
            setLoading(true);
            setError('');
            const response = await patientService.getAllPatients({ search, page: 0, size: 100 });
            if (response.success && response.data?.items) {
                setPatients(response.data.items);
            } else if (response.success && Array.isArray(response.data)) {
                setPatients(response.data);
            } else {
                setPatients([]);
            }
        } catch {
            setError('Could not load patients data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(() => fetchPatients(searchTerm), 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const openAddModal = () => {
        setEditingPatient(null);
        setForm({ ...EMPTY_FORM });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (p: any) => {
        setEditingPatient(p);
        setForm({
            firstName: p.firstName || '',
            lastName: p.lastName || '',
            nic: p.nic || '',
            phone: p.phone || '',
            email: p.email || '',
            dateOfBirth: p.dateOfBirth || '',
            gender: p.gender || '',
            address: p.address || '',
            isActive: p.isActive ?? true,
        });
        setFormError('');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.firstName.trim() || !form.lastName.trim()) {
            setFormError('First Name and Last Name are required.');
            return;
        }
        try {
            setSaving(true);
            setFormError('');
            if (editingPatient) {
                await patientService.updatePatient(editingPatient.id, form);
            } else {
                await patientService.addPatient(form);
            }
            setShowModal(false);
            fetchPatients(searchTerm);
        } catch (err: any) {
            setFormError(err?.response?.data?.message || 'Failed to save patient. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = (id: string) => { setDeletingId(id); setDeleteError(''); setShowDeleteConfirm(true); };
    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            setDeleting(true);
            setDeleteError('');
            await patientService.deletePatient(deletingId);
            setShowDeleteConfirm(false);
            setDeletingId(null);
            fetchPatients(searchTerm);
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Patient Directory</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage registered hospital patients.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => fetchPatients(searchTerm)} className="flex items-center justify-center p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md transition-colors" title="Refresh">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-md font-medium shadow-btn transition-colors">
                        <Plus className="w-5 h-5" /> Add Patient
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-card border border-gray-100 dark:border-dark-border flex gap-4 items-center transition-colors">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" className={`${inputClass} pl-10`} placeholder="Search by name, NIC, phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-gray-100 dark:border-dark-border overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-dark-border/50 border-b border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Patient Details</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">NIC</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Gender • DOB</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-2" />Loading patient directory...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-red-500">{error}</td></tr>
                            ) : patients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 dark:bg-dark-border/30 rounded-full flex items-center justify-center">
                                                <UserRound className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Empty Patient Directory</h3>
                                                <p className="text-gray-500 dark:text-gray-400 mt-1">Click "Add Patient" to register a new patient.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                patients.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-bg flex items-center justify-center border border-gray-200 dark:border-dark-border">
                                                    <UserRound className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-200">{p.firstName} {p.lastName}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{p.nic || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600 dark:text-gray-400">{p.phone}</div>
                                            <div className="text-xs text-gray-400">{p.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 capitalize">{p.gender || '-'} • {p.dateOfBirth || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${p.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {p.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditModal(p)} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-1" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => confirmDelete(p.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPatient ? 'Edit Patient' : 'Add New Patient'} size="xl">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                            <input type="text" className={inputClass} placeholder="John" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                            <input type="text" className={inputClass} placeholder="Doe" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>NIC Number</label>
                            <input type="text" className={inputClass} placeholder="991234567V" value={form.nic} onChange={(e) => setForm({ ...form, nic: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input type="tel" className={inputClass} placeholder="077 123 4567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input type="email" className={inputClass} placeholder="patient@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <DateInput
                                label="Date of Birth"
                                value={form.dateOfBirth}
                                onChange={(val) => setForm({ ...form, dateOfBirth: val })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Gender</label>
                            <select className={inputClass} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        {editingPatient && (
                            <div className="flex items-center gap-3 pt-5">
                                <input type="checkbox" id="patIsActive" className="w-4 h-4 rounded text-primary-600 border-gray-300" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                                <label htmlFor="patIsActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active patient</label>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className={labelClass}>Address</label>
                        <textarea className={`${inputClass} resize-none`} rows={2} placeholder="Patient home address..." value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    </div>

                    {formError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">{formError}</p>}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-border mt-4">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-md transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : (editingPatient ? 'Update Patient' : 'Add Patient')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setDeleteError(''); }} title="Confirm Delete" size="sm">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to delete this patient record? This action cannot be undone.</p>
                {deleteError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md mb-4">{deleteError}</p>}
                <div className="flex justify-end gap-3">
                    <button onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); }} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-md transition-colors">
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminPatients;
