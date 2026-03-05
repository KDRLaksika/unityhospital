import { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import unityHospitalLogo from '../assets/images/unity-hospital-logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login({ username, password });
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center p-4 transition-colors duration-200">
            <div className="max-w-md w-full">

                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={unityHospitalLogo}
                        alt="Unity Hospital Logo"
                        className="w-24 h-24 object-contain mb-3 drop-shadow-md"
                    />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Unity Hospital</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Administration Portal Gateway</p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-card border border-gray-100 dark:border-dark-border transition-colors duration-200">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">System Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 dark:bg-dark-bg focus:bg-white dark:focus:bg-dark-card text-gray-900 dark:text-gray-100"
                                    placeholder="Enter your system username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Security Key (Password)</label>
                                <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">Forgot key?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 dark:bg-dark-bg focus:bg-white dark:focus:bg-dark-card text-gray-900 dark:text-gray-100"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-btn text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors mt-2"
                        >
                            Authorize Access
                        </button>
                    </form>
                </div>

                {/* Footer Footer */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
                    © 2025 Unity Hospital Administration System.<br />Authorized personnel only.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
