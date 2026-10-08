import { MapActivitiesRepository } from '@/app/infra/repositories/MapActivitiesRepository';
import type { ErrorMessage } from '@/app/shared/Error';

const DEFAULT_COLOR = '#9580b5';

export interface RecentActivityItem {
    id: string;
    type: 'habit' | 'task';
    title: string;
    icon: string;
    color: string;
    completedAt: string;
}

export const RetrieveRecentActivityService = {

    getRecentActivity: async (limit = 8): Promise<{ items: RecentActivityItem[]; error: ErrorMessage | null }> => {
        const [habitsResult, tasksResult] = await Promise.all([
            MapActivitiesRepository.getRecentHabitLogs(limit),
            MapActivitiesRepository.getRecentCompletedTasks(limit),
        ]);

        if (habitsResult.error || tasksResult.error) {
            return { items: [], error: habitsResult.error ?? tasksResult.error };
        }

        const habits: RecentActivityItem[] = (habitsResult.data ?? []).map(log => ({
            id: `habit-${log.id}`,
            type: 'habit',
            title: log.habits?.title ?? 'Hábito',
            icon: log.habits?.categories?.icon ?? 'Award',
            color: log.habits?.categories?.group?.color ?? DEFAULT_COLOR,
            completedAt: log.completed_at,
        }));

        const tasks: RecentActivityItem[] = (tasksResult.data ?? []).map(task => ({
            id: `task-${task.id}`,
            type: 'task',
            title: task.title,
            icon: task.categories?.icon ?? 'ClipboardList',
            color: task.categories?.group?.color ?? DEFAULT_COLOR,
            completedAt: task.completed_at,
        }));

        const items = [...habits, ...tasks]
            .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
            .slice(0, limit);

        return { items, error: null };
    },

};
