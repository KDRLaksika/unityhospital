import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Edit2, Trash2, User, Loader2, RefreshCw, Search, Save, Copy, Check } from 'lucide-react';
import { appointmentService } from '../api/appointmentService';
import { doctorService } from '../api/doctorService';
import { patientService } from '../api/patientService';
import Modal from '../components/Modal';
import TimeInput from '../components/TimeInput';
import DateInput from '../components/DateInput';

const EMPTY_FORM = {
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    note: '',
    status: 'SCHEDULED',
    isActive: true,
};

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);

    const [doctorsMap, setDoctorsMap] = useState<Record<string, any>>({});
    const [patientsMap, setPatientsMap] = useState<Record<string, any>>({});
    const [doctorsList, setDoctorsList] = useState<any[]>([]);
    const [patientsList, setPatientsList] = useState<any[]>([]);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<any>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    // Delete
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    // Copy feedback
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const fetchNames = async () => {
        try {
            const [doctorsRes, patientsRes] = await Promise.all([
                doctorService.getAllDoctors({ size: 1000, page: 1 }),
                patientService.getAllPatients({ size: 1000, page: 0 }),
            ]);
            const dMap: any = {};
            if (doctorsRes.success && doctorsRes.data?.items) {
                doctorsRes.data.items.forEach((d: any) => dMap[d.id] = d);
                setDoctorsList(doctorsRes.data.items);
            }
            setDoctorsMap(dMap);
            const pMap: any = {};
            if (patientsRes.success && patientsRes.data?.items) {
                patientsRes.data.items.forEach((p: any) => pMap[p.id] = p);
                setPatientsList(patientsRes.data.items);
            }
            setPatientsMap(pMap);
        } catch { /* silent */ }
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await appointmentService.getAllAppointments({});
            if (response.success && response.data?.items) {
                setAppointments(response.data.items);
            } else {
                setAppointments([]);
            }
        } catch {
            setError('Could not load appointments schedule.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase().trim();
        if (!lowerSearch) { setFilteredAppointments(appointments); return; }
        const filtered = appointments.filter(apt => {
            const patient = patientsMap[apt.patientId];
            const doctor = doctorsMap[apt.doctorId];
            return `${patient?.firstName} ${patient?.lastName}`.toLowerCase().includes(lowerSearch)
                || doctor?.fullName?.toLowerCase().includes(lowerSearch)
                || apt.id.toLowerCase().includes(lowerSearch);
        });
        setFilteredAppointments(filtered);
    }, [searchTerm, appointments, patientsMap, doctorsMap]);

    useEffect(() => {
        const loadAll = async () => { await fetchNames(); await fetchAppointments(); };
        loadAll();
    }, []);

    const openAddModal = () => {
        setEditingAppointment(null);
        setForm({ ...EMPTY_FORM });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (apt: any) => {
        setEditingAppointment(apt);
        setForm({
            patientId: apt.patientId || '',
            doctorId: apt.doctorId || '',
            appointmentDate: apt.appointmentDate || '',
            appointmentTime: apt.appointmentTime ? apt.appointmentTime.substring(0, 5) : '',
            note: apt.note || '',
            status: apt.status || 'SCHEDULED',
            isActive: apt.isActive ?? true,
        });
        setFormError('');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.patientId || !form.doctorId || !form.appointmentDate || !form.appointmentTime) {
            setFormError('Patient, Doctor, Date and Time are required.');
            return;
        }
        try {
            setSaving(true);
            setFormError('');
            const payload = { ...form };
            if (editingAppointment) {
                await appointmentService.updateAppointment(editingAppointment.id, payload);
            } else {
                await appointmentService.addAppointment(payload);
            }
            setShowModal(false);
            fetchAppointments();
        } catch (err: any) {
            setFormError(err?.response?.data?.message || 'Failed to save appointment.');
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
            await appointmentService.deleteAppointment(deletingId);
            setShowDeleteConfirm(false);
            setDeletingId(null);
            fetchAppointments();
        } catch (err: any) {
            setDeleteError(err?.response?.data?.message || 'Failed to delete. The server returned an error.');
        } finally {
            setDeleting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CHECKED_IN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-dark-bg dark:text-gray-300';
        }
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return '-';
        try {
            const [h, m] = timeStr.split(':');
            const hour = parseInt(h);
            return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
        } catch { return timeStr; }
    };

    const inputClass = "block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200 transition-colors";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Appointments Schedule</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {appointments.length} Appointments</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchAppointments} className="p-2.5 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 transition-colors" title="Refresh">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium shadow-btn transition-colors">
                        <Plus className="w-5 h-5" /> New Booking
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-card border border-gray-100 dark:border-dark-border flex gap-4 items-center transition-colors">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" className={`${inputClass} pl-10`} placeholder="Search by patient, doctor, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* Dept summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Cardiology', 'Neurology', 'Pediatrics', 'General'].map(dept => (
                    <div key={dept} className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-card border border-gray-100 dark:border-dark-border flex justify-between items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{dept}</span>
                        <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold px-3 py-1 rounded-full text-sm">
                            {dept === 'General'
                                ? appointments.filter(a => !['Cardiology', 'Neurology', 'Pediatrics'].includes(doctorsMap[a.doctorId]?.speciality)).length
                                : appointments.filter(a => doctorsMap[a.doctorId]?.speciality === dept).length}
                        </span>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-gray-100 dark:border-dark-border overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-dark-border/50 border-b border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Time</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Patient</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Consulting Doctor</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-2" />Loading schedule...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-red-500">{error}</td></tr>
                            ) : filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 dark:bg-dark-border/30 rounded-full flex items-center justify-center"><CalendarIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" /></div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{searchTerm ? 'No Matching Appointments' : 'No Appointments'}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 mt-1">{searchTerm ? `No results for "${searchTerm}"` : 'Click "New Booking" to schedule an appointment.'}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAppointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-200"><Clock className="w-4 h-4 text-gray-400" />{formatTime(apt.appointmentTime)}</div>
                                        <div className="text-xs text-gray-500 ml-6">{apt.appointmentDate}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                {patientsMap[apt.patientId] ? patientsMap[apt.patientId].firstName.charAt(0) : <User className="w-3 h-3" />}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-gray-200">
                                                {patientsMap[apt.patientId] ? `${patientsMap[apt.patientId].firstName} ${patientsMap[apt.patientId].lastName}` : 'Unknown Patient'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 dark:text-gray-200 font-medium">{doctorsMap[apt.doctorId]?.fullName ?? 'Unknown Doctor'}</div>
                                        <div className="text-xs text-gray-500">{doctorsMap[apt.doctorId]?.speciality ?? 'General'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(apt.status)}`}>{apt.status?.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1.5">
                                            <button
                                                onClick={() => handleCopyId(apt.id)}
                                                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-1 relative group"
                                                title="Copy Appointment ID"
                                            >
                                                {copiedId === apt.id
                                                    ? <Check className="w-4 h-4 text-green-500" />
                                                    : <Copy className="w-4 h-4" />}
                                                {copiedId === apt.id && (
                                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap font-medium">
                                                        Copied!
                                                    </span>
                                                )}
                                            </button>
                                            <button onClick={() => openEditModal(apt)} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-1" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => confirmDelete(apt.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingAppointment ? 'Edit Appointment' : 'New Booking'} size="lg">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Patient <span className="text-red-500">*</span></label>
                            <select className={inputClass} value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
                                <option value="">Select Patient</option>
                                {patientsList.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Doctor <span className="text-red-500">*</span></label>
                            <select className={inputClass} value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
                                <option value="">Select Doctor</option>
                                {doctorsList.map(d => <option key={d.id} value={d.id}>{d.fullName} – {d.speciality}</option>)}
                            </select>
                        </div>
                        <div>
                            <DateInput
                                label="Date"
                                required
                                value={form.appointmentDate}
                                onChange={(val) => setForm({ ...form, appointmentDate: val })}
                            />
                        </div>
                        <div>
                            <TimeInput
                                label="Time"
                                required
                                value={form.appointmentTime}
                                onChange={(val) => setForm({ ...form, appointmentTime: val })}
                            />
                        </div>
                        {editingAppointment && (
                            <div>
                                <label className={labelClass}>Status</label>
                                <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option value="SCHEDULED">Scheduled</option>
                                    <option value="CHECKED_IN">Checked In</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className={labelClass}>Note</label>
                        <textarea className={`${inputClass} resize-none`} rows={2} placeholder="Optional note..." value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                    </div>

                    {formError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">{formError}</p>}

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-border mt-4">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-md transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : (editingAppointment ? 'Update' : 'Book Appointment')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setDeleteError(''); }} title="Delete Appointment" size="sm">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to delete this appointment? This action cannot be undone.</p>
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

export default AdminAppointments;
