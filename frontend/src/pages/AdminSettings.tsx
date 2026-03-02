import { useState } from 'react';
import { Settings, User, Shield, Key, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/axiosConfig';

const AdminSettings = () => {
    const { user } = useAuth();

    // Change password form
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState(false);

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'STAFF': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'DOCTOR': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400';
        }
    };

    const handleChangePassword = async () => {
        setPwError('');
        setPwSuccess(false);

        if (!pwForm.currentPassword) { setPwError('Current password is required.'); return; }
        if (!pwForm.newPassword || pwForm.newPassword.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
        if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('New passwords do not match.'); return; }

        try {
            setPwSaving(true);
            // First get reset token using the forgot-password flow (since we have no "change password" endpoint)
            // We'll use direct update via PUT /auth/me/password if available, or skip
            // For now, show success message as the backend reset flow requires email token
            // We use axiosConfig auth API to call a hypothetical change-password endpoint
            await authApi.post('/auth/change-password', {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            setPwSuccess(true);
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            // If endpoint doesn't exist yet, show a friendly message
            const msg = err?.response?.data?.message;
            if (err?.response?.status === 404) {
                setPwError('Password change endpoint is not yet available. Please contact your administrator.');
            } else {
                setPwError(msg || 'Failed to change password. Please check your current password and try again.');
            }
        } finally {
            setPwSaving(false);
        }
    };

    const inputClass = "block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-200 transition-colors";

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account information and security settings</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-transparent dark:border-dark-border p-6">
                <div className="flex items-center gap-3 mb-5">
                    <Settings className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Profile Information</h2>
                </div>

                <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl font-bold text-primary-700 dark:text-primary-400 uppercase flex-shrink-0">
                        {user?.email ? user.email.charAt(0) : 'U'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {user?.email || 'Unknown User'}
                            </p>
                            {user?.role && (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                                    {user.role}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">User ID: {user?.userId || 'N/A'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border border-gray-100 dark:border-dark-border">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.email || '—'}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Shield className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Access Role</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.role || '—'}</p>
                    </div>
                </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-card border border-transparent dark:border-dark-border p-6">
                <div className="flex items-center gap-3 mb-5">
                    <Key className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Change Password</h2>
                </div>

                {pwError && (
                    <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md mb-4">{pwError}</p>
                )}
                {pwSuccess && (
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md mb-4">
                        <Check className="w-4 h-4" />
                        Password changed successfully!
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={pwForm.currentPassword}
                                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                                className={inputClass + ' pr-10'}
                                placeholder="Enter current password"
                            />
                            <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={pwForm.newPassword}
                                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                                className={inputClass + ' pr-10'}
                                placeholder="Min. 6 characters"
                            />
                            <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={pwForm.confirmPassword}
                            onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                            className={inputClass}
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleChangePassword}
                            disabled={pwSaving}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-md transition-colors"
                        >
                            {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                            {pwSaving ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
