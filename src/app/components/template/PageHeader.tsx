import { CalendarDays } from "lucide-react";
import { useAuth } from "../../contexts/auth/useAuth";

interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
}

const formatToday = () => {
    const text = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
    const { user } = useAuth();
    const initials = `${user?.name?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase();

    return (
        <header className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-950">{title}</h1>
                {subtitle && <p className="mt-2 text-primary-500 max-w-xl">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
                <span className="hidden sm:flex items-center gap-2 rounded-full bg-surface/80 shadow-clay-sm px-4 py-2.5 text-sm font-bold text-primary-700">
                    <CalendarDays size={16} className="text-tertiary-500" />
                    {formatToday()}
                </span>
                <span
                    title={`${user?.name ?? ''} ${user?.lastName ?? ''}`}
                    className="size-11 rounded-full clay-blue shadow-clay-pressed flex items-center justify-center font-heading font-bold text-secondary-950"
                >
                    {initials || '·'}
                </span>
            </div>
        </header>
    );
};
