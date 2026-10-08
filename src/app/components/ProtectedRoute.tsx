import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/auth/useAuth';

interface ProtectedRouteProps {
    element: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-bold text-primary-500 animate-pulse">Cargando…</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{element}</>;
};
