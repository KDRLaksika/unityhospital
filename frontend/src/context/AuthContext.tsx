import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

interface User {
    role: string;
    email: string;
    userId?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decode a JWT payload without a library (base64 decode the middle part)
function decodeJwtPayload(token: string): any {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(base64);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // Decode JWT to get the actual role — fixes the hardcoded ADMIN bug
            const payload = decodeJwtPayload(storedToken);
            if (payload) {
                setUser({
                    role: payload.role || 'UNKNOWN',
                    email: payload.email || '',
                    userId: payload.sub,
                });
            }
        }
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await authService.login(credentials);
            if (response.success && response.data && response.data.accessToken) {
                const { accessToken, role, email, userId } = response.data;
                localStorage.setItem('token', accessToken);
                setToken(accessToken);
                setUser({ role, email, userId });
            } else {
                throw new Error(response.message || 'Authentication failed');
            }
        } catch (error: any) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAdmin = user?.role === 'ADMIN';
    const isStaff = user?.role === 'STAFF' || user?.role === 'DOCTOR';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isAdmin, isStaff }}>
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
