import { twMerge } from "tailwind-merge";
import { Card } from "./Card";

const colorMap: Record<string, string> = {
    success: 'bg-green-200 text-green-600',
    danger:   'bg-red-200 text-red-600',
    warning: 'bg-yellow-200 text-yellow-600',
    info: 'bg-cyan-200 text-cyan-600',
    default: 'bg-gray-200 text-gray-600'
};

interface NotificationProps {
    children: React.ReactNode,
    color: "success" | "danger" | "warning" | "info" | "default",
    leaving?: boolean;
}

export const Notification: React.FC<NotificationProps> = ( { children, color = 'default', leaving} ) => {

    const colorClass = colorMap[color];

    return (
        <div className={leaving ? 'animate-notification-out' : 'animate-notification-in'}>
            <Card className={twMerge('rounded-2xl p-5', colorClass)}>
                {children}
            </Card>
        </div>
    );
}