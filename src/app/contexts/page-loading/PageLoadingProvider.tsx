import { useCallback, useMemo, useRef, useState } from "react";
import { PageLoadingContext } from "./PageLoadingContext";

// Mantiene el skeleton de toda la página hasta que termina la última carga inicial.
// Después, los refrescos (cambiar de día, mover una tarea...) solo afectan a su componente.
export const PageLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pending = useRef(new Set<string>());
    const [isPageLoading, setIsPageLoading] = useState(true);

    const setLoading = useCallback((id: string, loading: boolean) => {
        if (loading) pending.current.add(id);
        else pending.current.delete(id);
        // Se comprueba cuando ya han corrido todos los efectos del render: al montar, todas las cargas están registradas
        queueMicrotask(() => {
            if (pending.current.size === 0) setIsPageLoading(false);
        });
    }, []);

    const value = useMemo(() => ({ isPageLoading, setLoading }), [isPageLoading, setLoading]);

    return <PageLoadingContext.Provider value={value}>{children}</PageLoadingContext.Provider>;
};
