import { MOCK_USER } from '@/app/infra/mocks/mockSeed';

export const LoginMockService = {

    // Cualquier usuario/contraseña vale: entra siempre con el usuario demo
    login: async (username: string) => ({
        user: { ...MOCK_USER, username: username || MOCK_USER.username },
        error: null,
    }),

    logout: async () => ({ error: null }),

    getSession: async () => ({ data: { session: null }, error: null }),

};
