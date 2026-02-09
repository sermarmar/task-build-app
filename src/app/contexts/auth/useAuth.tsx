import { useContext } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};
