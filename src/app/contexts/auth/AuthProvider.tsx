import React, { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import { LoginService } from '../../../services/LoginService';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Verificar si hay sesión guardada al montar el componente
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const savedUser = sessionStorage.getItem('user');

        if (token && savedUser) {
            setIsAuthenticated(true);
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await LoginService.login(username, password);
            if (response.success) {
                setIsAuthenticated(true);
                setUser(username);
                sessionStorage.setItem('user', username);
                sessionStorage.setItem('token', response.token);
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    };

    const value: AuthContextType = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
