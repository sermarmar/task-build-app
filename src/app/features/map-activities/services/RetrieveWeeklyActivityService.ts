import { MapActivitiesRepository } from '@/app/infra/repositories/MapActivitiesRepository';
import { toLocalDateString } from '@/app/features/habits/helpers/daysHelpers';
import type { ErrorMessage } from '@/app/shared/Error';

const WEEKS = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface WeeklyActivity {
    labels: string[];
    habits: number[];
    tasks: number[];
}

const startOfWeek = (date: Date): Date => {
    const monday = new Date(date);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return monday;
};

export const RetrieveWeeklyActivityService = {

    getWeeklyActivity: async (): Promise<{ weekly: WeeklyActivity | null; error: ErrorMessage | null }> => {
        const today = new Date();
        const start = startOfWeek(today);
        start.setDate(start.getDate() - (WEEKS - 1) * 7);

        // tasks.completed_at es timestamptz: se pide hasta mañana para no perder lo completado hoy
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const [habitsResult, tasksResult] = await Promise.all([
            MapActivitiesRepository.getHabitLogsByDateRange(toLocalDateString(start), toLocalDateString(today)),
            MapActivitiesRepository.getCompletedTasksByDateRange(toLocalDateString(start), toLocalDateString(tomorrow)),
        ]);

        if (habitsResult.error || tasksResult.error) {
            return { weekly: null, error: habitsResult.error ?? tasksResult.error };
        }

        const countByWeek = (logs: { completed_at: string }[]) => {
            const counts = Array<number>(WEEKS).fill(0);
            logs.forEach(({ completed_at }) => {
                const day = new Date(`${String(completed_at).slice(0, 10)}T00:00:00`);
                const week = Math.floor((day.getTime() - start.getTime()) / (7 * DAY_MS));
                if (week >= 0 && week < WEEKS) counts[week]++;
            });
            return counts;
        };

        const labels = Array.from({ length: WEEKS }, (_, i) => {
            const weekStart = new Date(start);
            weekStart.setDate(start.getDate() + i * 7);
            return weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        });

        return {
            weekly: { labels, habits: countByWeek(habitsResult.data ?? []), tasks: countByWeek(tasksResult.data ?? []) },
            error: null,
        };
    },

};
