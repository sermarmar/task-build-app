import { useContext, useEffect, useId } from "react";
import { PageLoadingContext } from "./PageLoadingContext";

// true mientras esta carga o cualquier otra de la página siga pendiente.
// Fuera de un PageLoadingProvider devuelve la carga propia tal cual.
export const usePageLoading = (isLoading: boolean): boolean => {
    const context = useContext(PageLoadingContext);
    const setLoading = context?.setLoading;
    const id = useId();

    useEffect(() => {
        setLoading?.(id, isLoading);
        return () => setLoading?.(id, false);
    }, [setLoading, id, isLoading]);

    return isLoading || (context?.isPageLoading ?? false);
};
