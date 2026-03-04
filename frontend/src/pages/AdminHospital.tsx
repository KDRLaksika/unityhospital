import { useState, useEffect } from 'react';
import {
    Plus, Edit2, Trash2, Loader2, RefreshCw, Save,
    CalendarCheck, DollarSign, AlertCircle,
    Phone, Mail, MapPin, User, Layout
} from 'lucide-react';
import { hospitalService } from '../api/hospitalService';
import { pricingService } from '../api/pricingService';
import { organizationService } from '../api/organizationService';
import Modal from '../components/Modal';
import DateInput from '../components/DateInput';
import { useAuth } from '../context/AuthContext';

type TabType = 'types' | 'pricing';

const AdminHospital = () => {
    const { isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('types');

    const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);
    const [pricePlans, setPricePlans] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Record<string, string>>({});

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'TYPE' | 'PRICING' | 'PROFILE'>('TYPE');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const [typeForm, setTypeForm] = useState({ name: '', description: '', isActive: true });
    const [pricingForm, setPricingForm] = useState({ name: '', appointmentTypeId: '', amount: '', currency: 'LKR', effectiveFrom: new Date().toISOString().split('T')[0], effectiveTo: '' });
    const [profileForm, setProfileForm] = useState({ name: '', address: '', phone: '', email: '' });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingMode, setDeletingMode] = useState<'TYPE' | 'PRICING' | 'PROFILE'>('TYPE');

    const inputClass = "block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200 transition-colors";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    const fetchData = async () => {
        setLoading(true);
        setError({});
        const results = await Promise.allSettled([
            hospitalService.getAllAppointmentTypes(),
            pricingService.getAllPricePlans(),
            organizationService.getAllCompanyDetails(),
        ]);
        const newErrors: Record<string, string> = {};

        if (results[0].status === 'fulfilled') {
            const res = results[0].value;
            if (res.success) setAppointmentTypes(res.data?.items || res.data || []);
            else newErrors.types = res.message || 'Failed to load appointment types.';
        } else { newErrors.types = 'Service unreachable (hospitalservice).'; }

        if (results[1].status === 'fulfilled') {
            const res = results[1].value;
            if (res.success) setPricePlans(res.data?.items || res.data || []);
            else newErrors.pricing = res.message || 'Failed to load price plans.';
        } else { newErrors.pricing = 'Service unreachable (pricingservice).'; }

        if (results[2].status === 'fulfilled') {
            const res = results[2].value;
            if (res.success) setProfiles(res.data?.items || res.data || []);
            else newErrors.profile = res.message || 'Failed to load hospital profile.';
        } else { newErrors.profile = 'Service unreachable (organizationservice).'; }

        setError(newErrors);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const openAddModal = (mode: 'TYPE' | 'PRICING' | 'PROFILE') => {
        setModalMode(mode);
        setEditingItem(null);
        setFormError('');
        if (mode === 'TYPE') setTypeForm({ name: '', description: '', isActive: true });
        if (mode === 'PRICING') setPricingForm({ name: '', appointmentTypeId: '', amount: '', currency: 'LKR', effectiveFrom: new Date().toISOString().split('T')[0], effectiveTo: '' });
        if (mode === 'PROFILE') setProfileForm({ name: '', address: '', phone: '', email: '' });
        setShowModal(true);
    };

    const openEditModal = (mode: 'TYPE' | 'PRICING' | 'PROFILE', item: any) => {
        setModalMode(mode);
        setEditingItem(item);
        setFormError('');
        if (mode === 'TYPE') setTypeForm({ name: item.name || '', description: item.description || '', isActive: item.isActive !== false });
        if (mode === 'PRICING') setPricingForm({ name: item.name || '', appointmentTypeId: item.appointmentTypeId || '', amount: item.amount?.toString() || '', currency: item.currency || 'LKR', effectiveFrom: item.effectiveFrom || '', effectiveTo: item.effectiveTo || '' });
        if (mode === 'PROFILE') setProfileForm({ name: item.name || '', address: item.address || '', phone: item.phone || '', email: item.email || '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        setFormError('');
        setSaving(true);
        try {
            if (modalMode === 'TYPE') {
                if (!typeForm.name.trim()) throw new Error('Name is required');
                if (editingItem) await hospitalService.updateAppointmentType(editingItem.id, typeForm);
                else await hospitalService.addAppointmentType({ name: typeForm.name.trim(), description: typeForm.description.trim() });
            } else if (modalMode === 'PRICING') {
                if (!pricingForm.name.trim() || !pricingForm.appointmentTypeId || !pricingForm.amount) throw new Error('All required fields must be filled');
                const payload = { ...pricingForm, amount: parseFloat(pricingForm.amount) };
                if (editingItem) await pricingService.updatePricePlan(editingItem.id, payload);
                else await pricingService.addPricePlan(payload);
            } else if (modalMode === 'PROFILE') {
                if (!profileForm.name.trim()) throw new Error('Hospital name is required');
                if (editingItem) await organizationService.updateCompanyDetail(editingItem.id, profileForm);
                else await organizationService.addCompanyDetail(profileForm);
            }
            setShowModal(false);
            fetchData();
        } catch (err: any) {
            setFormError(err.message || err?.response?.data?.message || 'Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = (id: string, mode: 'TYPE' | 'PRICING' | 'PROFILE') => {
        setDeletingId(id);
        setDeletingMode(mode);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            if (deletingMode === 'TYPE') await hospitalService.deleteAppointmentType(deletingId);
            else if (deletingMode === 'PRICING') await pricingService.deletePricePlan(deletingId);
            else if (deletingMode === 'PROFILE') await organizationService.deleteCompanyDetail(deletingId);
            setShowDeleteConfirm(false);
            fetchData();
        } catch (err: any) {
            alert(err?.response?.data?.message || 'Failed to delete.');
        }
    };

    // Single profile — only ever use profiles[0]
    const profile = profiles[0] ?? null;

    const tabs: { id: TabType; label: string; icon: React.ComponentType<any> }[] = [
        { id: 'types', label: 'Appointment Types', icon: CalendarCheck },
        { id: 'pricing', label: 'Service Pricing', icon: DollarSign },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Hospital Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage service categories, pricing plans, and hospital profile.</p>
                </div>
                <button
                    onClick={fetchData}
                    title="Refresh"
                    className="p-2.5 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Tab bar — spans the full left width, sits above the content+card row */}
            <div className="flex border-b border-gray-200 dark:border-dark-border overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Two-column layout: tab content LEFT  |  profile card RIGHT */}
            <div className="flex flex-col xl:flex-row gap-6 items-start pt-5">

                {/* ─── LEFT COLUMN: tab panel content ─── */}
                <div className="flex-1 min-w-0 space-y-0">

                    {/* Appointment Types */}
                    {activeTab === 'types' && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatsCard title="Total Types" value={appointmentTypes.length} icon={Layout} color="blue" />
                                <StatsCard title="Active" value={appointmentTypes.filter(t => t.isActive !== false).length} icon={CalendarCheck} color="green" />
                                <StatsCard title="Inactive" value={appointmentTypes.filter(t => t.isActive === false).length} icon={AlertCircle} color="orange" />
                            </div>
                            {error.types ? <ErrorBanner message={error.types} /> : (
                                <Table
                                    title="Appointment Types"
                                    onAdd={isAdmin ? () => openAddModal('TYPE') : undefined}
                                    headers={['Type Name', 'Description', 'Status']}
                                    items={appointmentTypes}
                                    renderRow={(t: any) => (
                                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{t.name}</td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{t.description || '-'}</td>
                                            <td className="px-6 py-4"><Badge status={t.isActive !== false ? 'active' : 'inactive'} /></td>
                                            {isAdmin && (
                                                <td className="px-6 py-4 text-right">
                                                    <Actions onEdit={() => openEditModal('TYPE', t)} onDelete={() => confirmDelete(t.id, 'TYPE')} />
                                                </td>
                                            )}
                                        </tr>
                                    )}
                                />
                            )}
                        </div>
                    )}

                    {/* Service Pricing */}
                    {activeTab === 'pricing' && (
                        <div className="space-y-5 pt-5">
                            {error.pricing ? <ErrorBanner message={error.pricing} /> : (
                                <Table
                                    title="Service Price Plans"
                                    onAdd={isAdmin ? () => openAddModal('PRICING') : undefined}
                                    headers={['Plan Name', 'Appointment Type', 'Amount', 'Effective From']}
                                    items={pricePlans}
                                    renderRow={(plan: any) => (
                                        <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{plan.name}</td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {appointmentTypes.find(t => t.id === plan.appointmentTypeId)?.name || 'Unknown Type'}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{plan.currency} {plan.amount?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{plan.effectiveFrom}</td>
                                            {isAdmin && (
                                                <td className="px-6 py-4 text-right">
                                                    <Actions onEdit={() => openEditModal('PRICING', plan)} onDelete={() => confirmDelete(plan.id, 'PRICING')} />
                                                </td>
                                            )}
                                        </tr>
                                    )}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* ─── RIGHT COLUMN: Hospital Profile Card (always visible) ─── */}
                <div className="w-full xl:w-80 flex-shrink-0">
                    {error.profile ? (
                        <ErrorBanner message={error.profile} />
                    ) : !profile ? (
                        /* Empty state */
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8 text-center">
                            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-primary-600 dark:text-primary-400">
                                    <rect x="10" y="3" width="4" height="18" rx="1.5" fill="currentColor" />
                                    <rect x="3" y="10" width="18" height="4" rx="1.5" fill="currentColor" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">No Profile Yet</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Set up your hospital information so staff can access it.</p>
                            {isAdmin && (
                                <button
                                    onClick={() => openAddModal('PROFILE')}
                                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm w-full justify-center"
                                >
                                    <Plus className="w-4 h-4" /> Set Up Profile
                                </button>
                            )}
                        </div>
                    ) : (
                        /* Filled profile card */
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden shadow-sm">
                            {/* Hero banner */}
                            <div className="bg-gradient-to-br from-primary-600 to-blue-700 px-6 py-8 relative overflow-hidden">
                                {/* Decorative circles */}
                                <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/5 rounded-full" />
                                <div className="absolute -bottom-8 -left-4 w-36 h-36 bg-white/5 rounded-full" />

                                <div className="relative">
                                    {/* Logo */}
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30 mb-4">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                                            <rect x="10" y="3" width="4" height="18" rx="1.5" fill="white" />
                                            <rect x="3" y="10" width="18" height="4" rx="1.5" fill="white" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-white leading-tight">{profile.name}</h2>
                                    <p className="text-blue-100 text-xs mt-1 font-medium">Healthcare Provider</p>
                                </div>

                                {/* Admin edit/delete buttons */}
                                {isAdmin && (
                                    <div className="relative mt-4 flex gap-2">
                                        <button
                                            onClick={() => openEditModal('PROFILE', profile)}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-colors border border-white/20"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(profile.id, 'PROFILE')}
                                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-500/30 hover:bg-red-500/50 text-white rounded-lg text-xs font-semibold transition-colors border border-red-400/30"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Contact details */}
                            <div className="p-5 space-y-4">
                                <ContactRow icon={Phone} iconColor="blue" label="Phone" value={profile.phone} />
                                <ContactRow icon={Mail} iconColor="purple" label="Email" value={profile.email} />
                                <ContactRow icon={MapPin} iconColor="green" label="Address" value={profile.address} />
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg/50 flex items-center justify-between">
                                <p className="text-[11px] text-gray-400">
                                    Updated: {profile.updatedAt
                                        ? new Date(profile.updatedAt).toLocaleDateString()
                                        : profile.createdAt
                                            ? new Date(profile.createdAt).toLocaleDateString()
                                            : '—'}
                                </p>
                                {!isAdmin && (
                                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">Read-only</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Add / Edit Modal ── */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={`${editingItem ? 'Edit' : 'Add'} ${modalMode === 'TYPE' ? 'Appointment Type' : modalMode === 'PRICING' ? 'Price Plan' : 'Hospital Profile'}`}
                size="md"
            >
                <div className="space-y-4">
                    {/* ── TYPE form ── */}
                    {modalMode === 'TYPE' && (
                        <>
                            <div>
                                <label className={labelClass}>Type Name *</label>
                                <input type="text" className={inputClass} value={typeForm.name} onChange={e => setTypeForm({ ...typeForm, name: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea className={inputClass} rows={3} value={typeForm.description} onChange={e => setTypeForm({ ...typeForm, description: e.target.value })} />
                            </div>
                            {editingItem && (
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="isActive" checked={typeForm.isActive} onChange={e => setTypeForm({ ...typeForm, isActive: e.target.checked })} />
                                    <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── PRICING form ── */}
                    {modalMode === 'PRICING' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Plan Name *</label>
                                <input type="text" className={inputClass} value={pricingForm.name} onChange={e => setPricingForm({ ...pricingForm, name: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Appointment Type *</label>
                                <select className={inputClass} value={pricingForm.appointmentTypeId} onChange={e => setPricingForm({ ...pricingForm, appointmentTypeId: e.target.value })}>
                                    <option value="">Select Type</option>
                                    {appointmentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Amount (LKR) *</label>
                                <input type="number" className={inputClass} value={pricingForm.amount} onChange={e => setPricingForm({ ...pricingForm, amount: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelClass}>Currency</label>
                                <input type="text" className={inputClass} value={pricingForm.currency} readOnly />
                            </div>
                            <div>
                                <DateInput label="Effective From *" value={pricingForm.effectiveFrom} onChange={val => setPricingForm({ ...pricingForm, effectiveFrom: val })} />
                            </div>
                            <div>
                                <DateInput label="Effective To" value={pricingForm.effectiveTo} onChange={val => setPricingForm({ ...pricingForm, effectiveTo: val })} />
                            </div>
                        </div>
                    )}

                    {/* ── PROFILE form ── */}
                    {modalMode === 'PROFILE' && (
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Hospital Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="text" className={`${inputClass} pl-10`} placeholder="e.g. Unity General Hospital" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="tel" className={`${inputClass} pl-10`} placeholder="+94 11 123 4567" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="email" className={`${inputClass} pl-10`} placeholder="info@unityhospital.lk" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <textarea className={`${inputClass} pl-10 resize-none`} rows={2} placeholder="123 Hospital Road, Colombo 03" value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {formError && (
                        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">{formError}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium text-sm disabled:opacity-60">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ── Delete Confirm Modal ── */}
            <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Deletion" size="sm">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to permanently delete this item?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                </div>
            </Modal>
        </div>
    );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const ContactRow = ({ icon: Icon, iconColor, label, value }: { icon: any; iconColor: string; label: string; value?: string }) => (
    <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl bg-${iconColor}-50 dark:bg-${iconColor}-900/20 flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 text-${iconColor}-600 dark:text-${iconColor}-400`} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug break-words">
                {value || <span className="text-gray-400 italic font-normal text-xs">Not provided</span>}
            </p>
        </div>
    </div>
);

const StatsCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-${color}-50 dark:bg-${color}-900/20`}>
            <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <p className="text-xs text-gray-500 font-medium uppercase">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
    </div>
);

const ErrorBanner = ({ message }: { message: string }) => (
    <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
    </div>
);

const Badge = ({ status }: { status: 'active' | 'inactive' }) => (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30' : 'bg-red-100 text-red-800 dark:bg-red-900/30'}`}>
        {status === 'active' ? 'Active' : 'Inactive'}
    </span>
);

const Actions = ({ onEdit, onDelete }: any) => (
    <div className="flex justify-end gap-2">
        <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
    </div>
);

const Table = ({ title, onAdd, headers, items, renderRow }: any) => (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
        {/* Sticky header row */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50">
            <h2 className="font-bold text-gray-800 dark:text-gray-200">{title}</h2>
            {onAdd && (
                <button onClick={onAdd} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all active:scale-95 shadow-sm">
                    <Plus className="w-4 h-4" /> Add New
                </button>
            )}
        </div>
        {/* Scrollable table area — only this inner section scrolls */}
        <div className="overflow-auto max-h-80" style={{ scrollbarWidth: 'thin' }}>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-dark-border/50 border-b dark:border-dark-border sticky top-0 z-10">
                    <tr>
                        {headers.map((h: string) => <th key={h} className="px-6 py-3 font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider text-[10px] whitespace-nowrap">{h}</th>)}
                        {onAdd && <th className="px-6 py-3 text-right w-24"></th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length + (onAdd ? 1 : 0)} className="px-6 py-10 text-center text-gray-500 font-medium">
                                No records found. {onAdd ? 'Click "Add New" to get started.' : ''}
                            </td>
                        </tr>
                    ) : items.map(renderRow)}
                </tbody>
            </table>
        </div>
    </div>
);


export default AdminHospital;
