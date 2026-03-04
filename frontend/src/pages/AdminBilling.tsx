import { useState, useEffect } from 'react';
import { Receipt, Plus, Edit2, Search, Download, CheckCircle2, AlertCircle, Loader2, RefreshCw, Save } from 'lucide-react';
import { billingService } from '../api/billingService';
import { patientService } from '../api/patientService';
import { pricingService } from '../api/pricingService';
import { appointmentService } from '../api/appointmentService';
import Modal from '../components/Modal';

const EMPTY_CREATE_FORM = { patientId: '', appointmentId: '', pricePlanId: '', totalAmount: '' };
const EMPTY_UPDATE_FORM = { status: 'PENDING' };

const AdminBilling = () => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [patientsMap, setPatientsMap] = useState<Record<string, any>>({});
    const [patientsList, setPatientsList] = useState<any[]>([]);
    const [pricePlansList, setPricePlansList] = useState<any[]>([]);
    const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<any>(null);
    const [createForm, setCreateForm] = useState({ ...EMPTY_CREATE_FORM });
    const [updateForm, setUpdateForm] = useState({ ...EMPTY_UPDATE_FORM });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const fetchPatients = async () => {
        try {
            const res = await patientService.getAllPatients({ size: 1000, page: 0 });
            if (res.success && res.data?.items) {
                const pMap: any = {};
                res.data.items.forEach((p: any) => pMap[p.id] = p);
                setPatientsMap(pMap);
                setPatientsList(res.data.items);
            }
        } catch { /* silent */ }
    };

    const fetchPricePlans = async () => {
        try {
            const res = await pricingService.getAllPricePlans({ size: 1000, page: 0 });
            if (res.success) setPricePlansList(res.data?.items || res.data || []);
        } catch { /* silent */ }
    };

    const fetchAppointments = async () => {
        try {
            const res = await appointmentService.getAllAppointments({ size: 1000, page: 0 });
            if (res.success) setAppointmentsList(res.data?.items || res.data || []);
        } catch { /* silent */ }
    };

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await billingService.getAllInvoices({ page: 0, size: 1000 });
            if (response.success && response.data?.items) {
                setInvoices(response.data.items);
            } else {
                setInvoices([]);
            }
        } catch {
            setError('Failed to load billing records.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase().trim();
        if (!lowerSearch) { setFilteredInvoices(invoices); return; }
        const filtered = invoices.filter(inv => {
            const patient = patientsMap[inv.patientId];
            return `${patient?.firstName} ${patient?.lastName}`.toLowerCase().includes(lowerSearch)
                || inv.id.toLowerCase().includes(lowerSearch);
        });
        setFilteredInvoices(filtered);
    }, [searchTerm, invoices, patientsMap]);

    useEffect(() => {
        const loadAll = async () => {
            await fetchPatients();
            await fetchPricePlans();
            await fetchAppointments();
            await fetchInvoices();
        };
        loadAll();
    }, []);

    const openCreateModal = () => {
        setCreateForm({ ...EMPTY_CREATE_FORM });
        setFormError('');
        setShowCreateModal(true);
    };

    const openUpdateModal = (inv: any) => {
        setEditingInvoice(inv);
        setUpdateForm({ status: inv.status || 'PENDING' });
        setFormError('');
        setShowUpdateModal(true);
    };

    // When price plan is selected, auto-fill the total amount
    const handlePricePlanChange = (planId: string) => {
        const plan = pricePlansList.find(p => p.id === planId);
        setCreateForm(f => ({
            ...f,
            pricePlanId: planId,
            totalAmount: plan ? plan.amount?.toString() : f.totalAmount,
        }));
    };

    const handleCreate = async () => {
        if (!createForm.patientId || !createForm.appointmentId || !createForm.pricePlanId || !createForm.totalAmount) {
            setFormError('All fields are required.');
            return;
        }
        try {
            setSaving(true);
            setFormError('');
            await billingService.createInvoice({
                patientId: createForm.patientId,
                appointmentId: createForm.appointmentId,
                pricePlanId: createForm.pricePlanId,
                totalAmount: parseFloat(createForm.totalAmount),
            });
            setShowCreateModal(false);
            fetchInvoices();
        } catch (err: any) {
            setFormError(err?.response?.data?.message || 'Failed to create invoice.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!editingInvoice?.id) return;
        try {
            setSaving(true);
            setFormError('');
            await billingService.updateInvoice(editingInvoice.id, { status: updateForm.status });
            setShowUpdateModal(false);
            fetchInvoices();
        } catch (err: any) {
            setFormError(err?.response?.data?.message || 'Failed to update invoice status.');
        } finally {
            setSaving(false);
        }
    };

    const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + (i.totalAmount || 0), 0);
    const totalPending = invoices.filter(i => i.status === 'PENDING').reduce((s, i) => s + (i.totalAmount || 0), 0);
    const totalOverdue = invoices.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + (i.totalAmount || 0), 0);

    const getStatusIcon = (status: string) => {
        if (status === 'PAID') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        if (status === 'OVERDUE') return <AlertCircle className="w-4 h-4 text-red-500" />;
        return <div className="w-2 h-2 rounded-full bg-yellow-400 mx-1" />;
    };

    const getStatusColor = (status: string) => {
        if (status === 'PAID') return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
        if (status === 'OVERDUE') return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    };

    // Find appointment label for display
    const getAppointmentLabel = (apt: any) => {
        const patient = patientsMap[apt.patientId];
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
        return `${patientName} · ${apt.appointmentDate} ${apt.appointmentTime || ''}`.trim();
    };

    const inputClass = "block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200 transition-colors";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Billing & Invoices</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage patient invoices, payments, and financial records.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchInvoices} className="p-2.5 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 transition-colors" title="Refresh">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-md font-medium shadow-btn transition-colors">
                        <Plus className="w-5 h-5" /> Generate Invoice
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-card border border-gray-100 dark:border-dark-border transition-colors">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue (Paid)</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">LKR {totalRevenue.toLocaleString()}</h3>
                    <p className="text-xs text-green-600 mt-2">{invoices.filter(i => i.status === 'PAID').length} Paid invoices</p>
                </div>
                <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-card border border-gray-100 dark:border-dark-border transition-colors">
                    <p className="text-sm font-medium text-gray-500 mb-1">Pending Payments</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">LKR {totalPending.toLocaleString()}</h3>
                    <p className="text-xs text-yellow-600 mt-2">{invoices.filter(i => i.status === 'PENDING').length} Invoices awaiting payment</p>
                </div>
                <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-card border border-gray-100 dark:border-dark-border transition-colors">
                    <p className="text-sm font-medium text-gray-500 mb-1">Overdue</p>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">LKR {totalOverdue.toLocaleString()}</h3>
                    <p className="text-xs text-red-600 mt-2">{invoices.filter(i => i.status === 'OVERDUE').length} Overdue invoices</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-card border border-gray-100 dark:border-dark-border flex gap-4 items-center transition-colors">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" className={`${inputClass} pl-10`} placeholder="Search by Invoice ID or Patient Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-gray-100 dark:border-dark-border overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-dark-border/50 border-b border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Invoice ID</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Patient</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Amount</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-2" />Loading invoices...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-red-500">{error}</td></tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 dark:bg-dark-border/20 rounded-full flex items-center justify-center"><Receipt className="w-10 h-10 text-gray-300" /></div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No Invoices Found</h3>
                                                <p className="text-sm text-gray-500 mt-1">Click "Generate Invoice" to create a new billing record.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-[10px] font-semibold text-gray-500">{inv.id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-400">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                                        {patientsMap[inv.patientId] ? `${patientsMap[inv.patientId].firstName} ${patientsMap[inv.patientId].lastName}` : 'Unknown Patient'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-200">LKR {inv.totalAmount?.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(inv.status)}`}>
                                            {getStatusIcon(inv.status)}{inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openUpdateModal(inv)} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-1" title="Update Status"><Edit2 className="w-4 h-4" /></button>
                                            <button className="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Download"><Download className="w-5 h-5 inline" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Generate Invoice" size="lg">
                <div className="space-y-4">
                    {/* Patient */}
                    <div>
                        <label className={labelClass}>Patient <span className="text-red-500">*</span></label>
                        <select className={inputClass} value={createForm.patientId} onChange={(e) => setCreateForm({ ...createForm, patientId: e.target.value })}>
                            <option value="">Select Patient</option>
                            {patientsList.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                        </select>
                    </div>

                    {/* Appointment Dropdown */}
                    <div>
                        <label className={labelClass}>Appointment <span className="text-red-500">*</span></label>
                        <select
                            className={inputClass}
                            value={createForm.appointmentId}
                            onChange={(e) => setCreateForm({ ...createForm, appointmentId: e.target.value })}
                        >
                            <option value="">Select Appointment</option>
                            {appointmentsList
                                .filter(a => !createForm.patientId || a.patientId === createForm.patientId)
                                .map(a => (
                                    <option key={a.id} value={a.id}>
                                        {getAppointmentLabel(a)} · {a.id.substring(0, 8)}...
                                    </option>
                                ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">Select a patient first to filter appointments.</p>
                    </div>

                    {/* Price Plan Dropdown */}
                    <div>
                        <label className={labelClass}>Price Plan <span className="text-red-500">*</span></label>
                        <select
                            className={inputClass}
                            value={createForm.pricePlanId}
                            onChange={(e) => handlePricePlanChange(e.target.value)}
                        >
                            <option value="">Select Price Plan</option>
                            {pricePlansList.map(plan => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} — LKR {plan.amount?.toLocaleString()}
                                </option>
                            ))}
                        </select>
                        {pricePlansList.length === 0 && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                ⚠ No price plans found. Add them in Hospital Settings → Service Pricing.
                            </p>
                        )}
                    </div>

                    {/* Total Amount — auto-filled from plan, but editable */}
                    <div>
                        <label className={labelClass}>Total Amount (LKR) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            className={inputClass}
                            placeholder="Auto-filled from price plan, or enter manually"
                            value={createForm.totalAmount}
                            onChange={(e) => setCreateForm({ ...createForm, totalAmount: e.target.value })}
                        />
                        {createForm.pricePlanId && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Amount auto-filled from selected price plan.</p>
                        )}
                    </div>

                    {formError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">{formError}</p>}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-border mt-4">
                        <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={handleCreate} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-md transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                            {saving ? 'Creating...' : 'Create Invoice'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Update Status Modal */}
            <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Update Invoice Status" size="sm">
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Invoice: <span className="font-mono font-semibold">{editingInvoice?.id?.substring(0, 8)}...</span></p>
                    <div>
                        <label className={labelClass}>New Status</label>
                        <select className={inputClass} value={updateForm.status} onChange={(e) => setUpdateForm({ status: e.target.value })}>
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="OVERDUE">Overdue</option>
                        </select>
                    </div>

                    {formError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">{formError}</p>}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-border mt-4">
                        <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={handleUpdateStatus} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-md transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Update Status'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminBilling;
