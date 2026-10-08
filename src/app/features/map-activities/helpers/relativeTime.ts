const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

// habit_logs.completed_at es una fecha ('YYYY-MM-DD'); tasks.completed_at un timestamp con hora
export const formatRelativeTime = (value: string): string => {
    const hasTime = value.length > 10;
    const date = hasTime ? new Date(value) : new Date(`${value}T00:00:00`);
    const now = new Date();
    const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);

    if (days <= 0) {
        if (!hasTime) return 'Hoy';
        const minutes = Math.max(1, Math.floor((now.getTime() - date.getTime()) / 60000));
        return minutes < 60 ? `Hace ${minutes} min` : `Hace ${Math.floor(minutes / 60)} h`;
    }
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};
