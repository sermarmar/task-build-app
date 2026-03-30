import { createContext } from "react";

export interface NotificationInterface {
    id: number;
    message: React.ReactNode;
    color: "success" | "danger" | "warning" | "info" | "default";
    leaving: boolean;
}

interface NotificationContextType {
    notify: (message: React.ReactNode, color?: NotificationInterface['color']) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);