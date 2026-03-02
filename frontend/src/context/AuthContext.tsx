import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

interface AuthContextType {
    user: any;
    token: string | null;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // Ideally decode JWT to get roles, here we assume it's valid
            setUser({ role: 'ADMIN', name: 'System Admin' });
        }
    }, [token]);

    const login = async (credentials: any) => {
        console.log('Attempting login through Gateway (8080) with:', credentials);
        try {
            const response = await authService.login(credentials);
            console.log('Login Response received:', response);

            // Backend wraps responses in { success, message, data }
            if (response.success && response.data && response.data.accessToken) {
                const { accessToken, role, email, userId } = response.data;
                localStorage.setItem('token', accessToken);
                setToken(accessToken);
                setUser({ role, email, userId });
            } else {
                console.error('Login failed logic check:', response);
                throw new Error(response.message || 'Authentication failed');
            }
        } catch (error: any) {
            console.error('Fatal Login Error (CORS or Network?):', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
