import { cn } from "@/utils/cn";

const colorMap: Record<string, string> = {
    success: 'text-emerald-800 [&_svg]:bg-emerald-100',
    danger:  'text-accent-blossom-800 [&_svg]:bg-accent-blossom-100',
    warning: 'text-tertiary-800 [&_svg]:bg-cream-200',
    info:    'text-secondary-800 [&_svg]:bg-secondary-100',
    default: 'text-primary-800 [&_svg]:bg-primary-100',
};

interface NotificationProps {
    children: React.ReactNode,
    color: "success" | "danger" | "warning" | "info" | "default",
    leaving?: boolean;
}

export const Notification: React.FC<NotificationProps> = ( { children, color = 'default', leaving} ) => {
    return (
        <div className={leaving ? 'animate-notification-out' : 'animate-notification-in'}>
            <div
                role="status"
                className={cn(
                    'flex items-center gap-3 rounded-2xl bg-surface shadow-clay px-4 py-3 font-bold text-sm',
                    '[&_svg]:size-8 [&_svg]:p-1.5 [&_svg]:rounded-full [&_svg]:shrink-0',
                    colorMap[color],
                )}
            >
                {children}
            </div>
        </div>
    );
}
