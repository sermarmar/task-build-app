// Doble candado: aunque VITE_USE_MOCKS llegue a Production por error, VITE_VERCEL_ENV (lo inyecta Vercel) lo bloquea
export const USE_MOCKS =
    import.meta.env.VITE_USE_MOCKS === 'true' &&
    import.meta.env.VITE_VERCEL_ENV !== 'production';
