import { supabase } from '../../../../config/Database';
import type { User } from '../model/User';

export const LoginService = {
    /**
     * Login usando username + password.
     * 1. Busca el email asociado al username en la tabla `profile`.
     * 2. Autentica con Supabase Auth usando email + password.
     */
    login: async (username: string, password: string): Promise<{ user: User | null, error: any }> => {
        // Paso 1: Obtener el email del perfil por username
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (profileError || !profile?.email) {
            return { user: null, error: { message: 'Usuario no encontrado.' } };
        }

        // Paso 2: Autenticar con email + contraseña
        const { data, error } = await supabase.auth.signInWithPassword({
            email: profile.email,
            password,
        });

        if (error) {
            return { user: null, error };
        }
        const user: User = {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            name: profile.name,
            lastName: profile.last_name,
        };

        return { user, error };
    },

    /**
     * Cierra la sesión del usuario actual.
     */
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    /**
     * Devuelve la sesión activa actual (si existe).
     */
    getSession: async () => {
        const { data, error } = await supabase.auth.getSession();
        return { data, error };
    },
};