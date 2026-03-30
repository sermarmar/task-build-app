import { useState } from "react";
import { Notification } from "../../components/ux/Notification";
import { NotificationContext, type NotificationInterface } from "./NotificationContext";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationInterface[]>([]);

    const notify = (message: React.ReactNode, color: NotificationInterface['color'] = 'default') => {
        const id = Date.now();

        setNotifications(prev => [...prev, { id, message, color, leaving: false }]);

        // Marca como "leaving" antes de eliminar
        setTimeout(() => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, leaving: true } : n));
        }, 4700);

        // Elimina del DOM tras la animación de salida
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        color={notification.color}
                        leaving={notification.leaving}
                    >
                        {notification.message}
                    </Notification>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};