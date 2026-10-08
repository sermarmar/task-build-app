import { createContext } from "react";

interface PageLoadingContextType {
    isPageLoading: boolean;
    setLoading: (id: string, loading: boolean) => void;
}

export const PageLoadingContext = createContext<PageLoadingContextType | null>(null);
