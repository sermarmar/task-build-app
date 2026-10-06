import { mockDb } from '@/app/infra/mocks/mockDb';

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

};
