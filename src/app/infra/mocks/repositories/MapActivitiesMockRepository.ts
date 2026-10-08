import { findCategoryWithGroup, mockDb } from '@/app/infra/mocks/mockDb';

const COMPLETED_STATUS_ID = 5;

const isInRange = (date: string, startDate: string, endDate: string) => {
    const day = date.slice(0, 10);
    return day >= startDate && day <= endDate;
};

export const MapActivitiesMockRepository = {

    getHabitLogsByDateRange: async (startDate: string, endDate: string) => {
        const logs = mockDb.read().habitLogs.filter(log => isInRange(log.completed_at, startDate, endDate));
        return { data: logs.map(log => ({ completed_at: log.completed_at })), error: null };
    },

    getCompletedTasksByDateRange: async (startDate: string, endDate: string) => {
        const tasks = mockDb.read().tasks.filter(task =>
            task.status_id === COMPLETED_STATUS_ID &&
            !!task.completed_at &&
            isInRange(task.completed_at, startDate, endDate)
        );
        return { data: tasks.map(task => ({ completed_at: task.completed_at! })), error: null };
    },

    getRecentHabitLogs: async (limit: number) => {
        const db = mockDb.read();
        const logs = [...db.habitLogs]
            .sort((a, b) => b.completed_at.localeCompare(a.completed_at))
            .slice(0, limit)
            .map(log => {
                const habit = db.habits.find(h => h.id === log.habit_id);
                const category = findCategoryWithGroup(db, habit?.category_id ?? null);
                return {
                    id: log.id,
                    completed_at: log.completed_at,
                    habits: habit ? {
                        title: habit.title,
                        categories: category ? { icon: category.icon, group: category.group ? { color: category.group.color } : null } : null,
                    } : null,
                };
            });
        return { data: logs, error: null };
    },

    getRecentCompletedTasks: async (limit: number) => {
        const db = mockDb.read();
        const tasks = db.tasks
            .filter(task => task.status_id === COMPLETED_STATUS_ID && !!task.completed_at)
            .sort((a, b) => b.completed_at!.localeCompare(a.completed_at!))
            .slice(0, limit)
            .map(task => {
                const category = findCategoryWithGroup(db, task.category_id);
                return {
                    id: task.id,
                    title: task.title,
                    completed_at: task.completed_at!,
                    categories: category ? { icon: category.icon, group: category.group ? { color: category.group.color } : null } : null,
                };
            });
        return { data: tasks, error: null };
    },

};
