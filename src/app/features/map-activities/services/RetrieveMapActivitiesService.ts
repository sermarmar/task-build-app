import { MapActivitiesRepository } from '../../../infra/repositories/MapActivitiesRepository';
import type { ActivityGrid, DayActivity } from '../models/MapActivity';

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function toLevel(count: number): DayActivity['level'] {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 7) return 3;
    return 4;
}

function toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export const RetrieveMapActivitiesService = {
    getActivityGrid: async (): Promise<{ grid: ActivityGrid | null; error: string | null }> => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Start from 52 weeks ago, aligned to Monday
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364);
        const dayOfWeek = startDate.getDay(); // 0=Sun
        const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startDate.setDate(startDate.getDate() + offsetToMonday);

        const endDate = today;

        // tasks.completed_at is a TIMESTAMPTZ — '2026-05-11' is cast to '2026-05-11 00:00:00 UTC'
        // by PostgreSQL, so lte would exclude tasks completed later that day. Pass tomorrow so
        // all of today's timestamps are included.
        const taskQueryEnd = new Date(today);
        taskQueryEnd.setDate(today.getDate() + 1);

        const [habitsResult, tasksResult] = await Promise.all([
            MapActivitiesRepository.getHabitLogsByDateRange(toDateStr(startDate), toDateStr(endDate)),
            MapActivitiesRepository.getCompletedTasksByDateRange(toDateStr(startDate), toDateStr(taskQueryEnd)),
        ]);

        if (habitsResult.error || tasksResult.error) {
            return { grid: null, error: habitsResult.error?.message ?? tasksResult.error?.message ?? 'Error desconocido' };
        }

        // Build count map: date string -> count (habits + tasks)
        const countMap: Record<string, number> = {};
        const allLogs = [...(habitsResult.data ?? []), ...(tasksResult.data ?? [])];
        for (const log of allLogs) {
            const dateKey = String(log.completed_at).slice(0, 10);
            countMap[dateKey] = (countMap[dateKey] ?? 0) + 1;
        }

        // Build weeks (Mon..Sun) from startDate to endDate
        const weeks: ActivityGrid['weeks'] = [];
        const monthLabels: ActivityGrid['months'] = [];
        const current = new Date(startDate);
        const seenMonths = new Set<string>();
        let weekIndex = 0;

        while (current <= endDate) {
            const weekDays: (DayActivity | null)[] = [];

            for (let d = 0; d < 7; d++) {
                const dateStr = toDateStr(current);

                if (current > endDate) {
                    weekDays.push(null);
                } else {
                    const count = countMap[dateStr] ?? 0;
                    weekDays.push({ date: dateStr, count, level: toLevel(count) });

                    const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
                    if (!seenMonths.has(monthKey) && d < 6) {
                        seenMonths.add(monthKey);
                        monthLabels.push({
                            label: MONTHS_ES[current.getMonth()],
                            weekIndex,
                        });
                    }
                }

                current.setDate(current.getDate() + 1);
            }

            weeks.push({ days: weekDays });
            weekIndex++;
        }

        const totalCount = allLogs.length;

        return { grid: { weeks, months: monthLabels, totalCount }, error: null };
    },
};
