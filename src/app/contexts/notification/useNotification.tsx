import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error('useNotification debe usarse dentro de <NotificationProvider>');
    }
    return ctx;
};