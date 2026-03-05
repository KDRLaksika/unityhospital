import { useState, useEffect } from 'react';
import { Pill, Plus, Edit2, Trash2, Search, AlertTriangle, Loader2, RefreshCw, Save } from 'lucide-react';
import { pharmacyService } from '../api/pharmacyService';
import Modal from '../components/Modal';

const EMPTY_FORM = { name: '', code: '', description: '', isActive: true };

const AdminPharmacy = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingDrug, setEditingDrug] = useState<any>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    // Delete
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const fetchDrugs = async (search: string = '') => {
        try {
            setLoading(true);
            setError('');
            const response = await pharmacyService.getAllDrugs({ search, page: 1, size: 100 });
            if (response.success && response.data?.items) {
                setInventory(response.data.items);
            } else {
                setInventory([]);
            }
        } catch {
            setError('Failed to load pharmacy inventory.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(() => fetchDrugs(searchTerm), 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const openAddModal = () => {
        setEditingDrug(null);
        setForm({ ...EMPTY_FORM });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (drug: any) => {
        setEditingDrug(drug);
        setForm({
            name: drug.name || '',
            code: drug.code || '',
            description: drug.description || '',
            isActive: drug.isActive ?? true,
        });
        setFormError('');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            setFormError('Drug Name is required.');
            return;
        }
        try {
            setSaving(true);
            setFormError('');
            if (editingDrug) {
                await pharmacyService.updateDrug(editingDrug.id, form);
            } else {
                await pharmacyService.createDrug(form);
            }
            setShowModal(false);
            fetchDrugs(searchTerm);
        } catch (err: any) {
            setFormError(err?.response?.data?.message || 'Failed to save drug.');
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
            await pharmacyService.deleteDrug(deletingId);
            setShowDeleteConfirm(false);
            setDeletingId(null);
            fetchDrugs(searchTerm);
        } catch (err: any) {
            setDeleteError(err?.response?.data?.message || 'Failed to delete. The server returned an error.');
        } finally {
            setDeleting(false);
        }
    };
    const inputClass = "block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200 transition-colors";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    const activeCount = inventory.filter(i => i.isActive).length;
    const inactiveCount = inventory.filter(i => !i.isActive).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Pharmacy Inventory</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage hospital drug catalog and stock thresholds.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => fetchDrugs(searchTerm)} className="p-2.5 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 transition-colors" title="Refresh">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-md font-medium shadow-btn transition-colors">
                        <Plus className="w-5 h-5" /> Add Medicine
                    </button>
                </div>
            </div>

            {/* Stats + Search row */}
            <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-card border border-gray-100 dark:border-dark-border flex flex-col sm:flex-row gap-4 justify-between items-center transition-colors">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" className={`${inputClass} pl-10`} placeholder="Search catalog by name or code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-4 text-sm shrink-0">
                    <span className="text-green-600 dark:text-green-400 font-medium">{activeCount} Active</span>
                    {inactiveCount > 0 && <span className="text-gray-500 dark:text-gray-400">{inactiveCount} Inactive</span>}
                    {!loading && inventory.length > 0 && (
                        <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-md">
                            <AlertTriangle className="w-4 h-4" /> {inventory.length} Drugs
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-gray-100 dark:border-dark-border overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-dark-border/50 border-b border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Code</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Drug Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Description</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Added</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-2" />Loading inventory...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-red-500">{error}</td></tr>
                            ) : inventory.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 dark:bg-dark-border/20 rounded-full flex items-center justify-center"><Pill className="w-10 h-10 text-gray-300" /></div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Inventory Empty</h3>
                                                <p className="text-sm text-gray-500 mt-1">Click "Add Medicine" to register the first drug.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : inventory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.code || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-100 dark:bg-dark-bg flex items-center justify-center border border-gray-200 dark:border-dark-border">
                                                <Pill className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <p className="font-medium text-gray-900 dark:text-gray-200">{item.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">{item.description || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${item.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-dark-bg dark:text-gray-400'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(item)} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-1" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => confirmDelete(item.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingDrug ? 'Edit Drug' : 'Add Medicine'} size="md">
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Drug Name <span className="text-red-500">*</span></label>
                        <input type="text" className={inputClass} placeholder="e.g. Amoxicillin 500mg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Code / SKU</label>
                        <input type="text" className={inputClass} placeholder="e.g. AMX-500" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea className={`${inputClass} resize-none`} rows={3} placeholder="Antibiotic used to treat bacterial infections..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    {editingDrug && (
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="drugIsActive" className="w-4 h-4 rounded text-primary-600 border-gray-300" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                            <label htmlFor="drugIsActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active in catalog</label>
                        </div>
                    )}

                    {formError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">{formError}</p>}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-border mt-4">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-md transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : (editingDrug ? 'Update Drug' : 'Add Drug')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setDeleteError(''); }} title="Delete Drug" size="sm">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to remove this drug from the catalog? This action cannot be undone.</p>
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

export default AdminPharmacy;
