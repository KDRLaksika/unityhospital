import { useState, useEffect } from 'react';
import { UserCog, Plus, Copy, Check, Mail, Loader2, RefreshCw, Search, Shield, Eye, EyeOff } from 'lucide-react';
import { authService } from '../api/authService';
import Modal from '../components/Modal';

// Generate a random strong password
const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Generate username from full name
const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '') + Math.floor(Math.random() * 99 + 1);
};

const EMPTY_FORM = {
    fullName: '',
    email: '',
    role: 'STAFF',
    username: '',
    password: '',
};

const AdminStaff = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Add staff modal
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Credential card after creation
    const [createdCredentials, setCreatedCredentials] = useState<{ username: string; password: string; role: string } | null>(null);
    const [showCredModal, setShowCredModal] = useState(false);
    const [copiedUser, setCopiedUser] = useState(false);
    const [copiedPass, setCopiedPass] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await authService.listUsers();
            if (response.success && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
            }
        } catch (err: any) {
            console.error('[AdminStaff] Fetch users error:', err);
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                setError('Access denied. You do not have permission to view staff accounts.');
            } else {
                setError('Could not load staff accounts. Make sure the auth service is running.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAddModal = () => {
        const pwd = generatePassword();
        setForm({ ...EMPTY_FORM, password: pwd });
        setFormError('');
        setShowPassword(true);
        setShowModal(true);
    };

    const handleFullNameChange = (name: string) => {
        setForm(f => ({ ...f, fullName: name, username: generateUsername(name) }));
    };

    const handleSave = async () => {
        if (!form.fullName.trim()) { setFormError('Full name is required.'); return; }
        if (!form.email.trim()) { setFormError('Email is required.'); return; }
        if (!form.username.trim()) { setFormError('Username is required.'); return; }
        if (!form.password || form.password.length < 6) { setFormError('Password must be at least 6 characters.'); return; }

        try {
            setSaving(true);
            setFormError('');
            const response = await authService.registerStaff({
                email: form.email.trim(),
                username: form.username.trim(),
                password: form.password,
                role: form.role,
            });

            if (response.success) {
                setCreatedCredentials({ username: form.username.trim(), password: form.password, role: form.role });
                setShowModal(false);
                setCopiedUser(false);
                setCopiedPass(false);
                setShowCredModal(true);
                fetchUsers();
            } else {
                setFormError(response.message || 'Failed to create account.');
            }
        } catch (err: any) {
            console.error('[AdminStaff] Register error — full error object:', err);
            console.error('[AdminStaff] HTTP status:', err?.response?.status);
            console.error('[AdminStaff] Response data:', err?.response?.data);
            console.error('[AdminStaff] Request config:', err?.config);
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message;
            setFormError(`Error ${err?.response?.status || ''}: ${serverMsg || 'Failed to create account. Please try again.'}`);
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = async (text: string, field: 'user' | 'pass') => {
        try {
            await navigator.clipboard.writeText(text);
            if (field === 'user') { setCopiedUser(true); setTimeout(() => setCopiedUser(false), 2000); }
            else { setCopiedPass(true); setTimeout(() => setCopiedPass(false), 2000); }
        } catch {
            // Fallback handled silently
        }
    };

    const copyAll = async () => {
        if (!createdCredentials) return;
        const text = `Username: ${createdCredentials.username}\nPassword: ${createdCredentials.password}`;
        await navigator.clipboard.writeText(text);
        setCopiedUser(true);
        setCopiedPass(true);
        setTimeout(() => { setCopiedUser(false); setCopiedPass(false); }, 2000);
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'STAFF': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'DOCTOR': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Create and manage staff accounts</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors shadow-sm text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Staff Account
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Accounts', value: users.length, color: 'text-gray-700 dark:text-gray-200' },
                    { label: 'Admin', value: users.filter(u => u.role === 'ADMIN').length, color: 'text-red-600 dark:text-red-400' },
                    { label: 'Staff', value: users.filter(u => u.role === 'STAFF').length, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Active', value: users.filter(u => u.isActive).length, color: 'text-green-600 dark:text-green-400' },
                ].map(card => (
                    <div key={card.label} className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-card border border-transparent dark:border-dark-border">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{card.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-transparent dark:border-dark-border overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by username, email, or role..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    />
                    <button onClick={fetchUsers} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-border text-gray-400 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                        <span className="ml-2 text-gray-500 dark:text-gray-400">Loading accounts...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-500 dark:text-red-400">
                        <Shield className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">{error}</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <UserCog className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="font-medium">No accounts found</p>
                        <p className="text-sm mt-1">Add a staff account to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Username</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                                {filteredUsers.map((u) => (
                                    <tr key={u.userId} className="hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors">
                                        <td className="px-6 py-3.5 font-medium text-gray-900 dark:text-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-400 uppercase">
                                                    {u.username?.charAt(0) || '?'}
                                                </div>
                                                {u.username}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-600 dark:text-gray-400">{u.email}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadge(u.role)}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400'}`}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Staff Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Staff Account" size="md">
                <div className="space-y-4">
                    {formError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">{formError}</p>}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={e => handleFullNameChange(e.target.value)}
                                placeholder="e.g. Jane Smith"
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="staff@hospital.com"
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username *</label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200"
                            />
                            <p className="text-xs text-gray-400 mt-1">Auto-generated from full name</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
                            <select
                                value={form.role}
                                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200"
                            >
                                <option value="STAFF">Staff</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    className="block w-full px-3 py-2 pr-20 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200 font-mono"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <button type="button" onClick={() => setShowPassword(v => !v)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button type="button" onClick={() => setForm(f => ({ ...f, password: generatePassword() }))} className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium px-1">
                                        Regenerate
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Auto-generated — staff can change it after logging in</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-md p-3">
                        <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            After creating the account, you'll see a credential card to copy and share with the staff member. A notification email will be sent to the provided email address.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-border mt-2">
                        <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-md transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCog className="w-4 h-4" />}
                            {saving ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Credentials Card Modal */}
            <Modal isOpen={showCredModal} onClose={() => setShowCredModal(false)} title="Account Created Successfully" size="md">
                {createdCredentials && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-md">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-green-800 dark:text-green-300">Account created successfully</p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">An email notification has been sent to the staff member.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-200 dark:border-dark-border p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Login Credentials</h3>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">USERNAME</p>
                                    <div className="flex items-center gap-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-md px-3 py-2.5">
                                        <code className="flex-1 text-sm font-mono text-gray-900 dark:text-gray-100">{createdCredentials.username}</code>
                                        <button
                                            onClick={() => copyToClipboard(createdCredentials.username, 'user')}
                                            className="flex-shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-gray-400 hover:text-primary-600"
                                            title="Copy username"
                                        >
                                            {copiedUser ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">PASSWORD</p>
                                    <div className="flex items-center gap-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-md px-3 py-2.5">
                                        <code className="flex-1 text-sm font-mono text-gray-900 dark:text-gray-100">{createdCredentials.password}</code>
                                        <button
                                            onClick={() => copyToClipboard(createdCredentials.password, 'pass')}
                                            className="flex-shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-gray-400 hover:text-primary-600"
                                            title="Copy password"
                                        >
                                            {copiedPass ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">ROLE</p>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${createdCredentials.role === 'ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : createdCredentials.role === 'DOCTOR' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                        {createdCredentials.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                            <span className="text-base">⚠️</span>
                            <p>This is the only time the password will be shown. Please copy it now or share it securely with the staff member.</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-dark-border">
                            <button onClick={copyAll} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">
                                <Copy className="w-4 h-4" />
                                Copy All Credentials
                            </button>
                            <button onClick={() => setShowCredModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 transition-colors">
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminStaff;
