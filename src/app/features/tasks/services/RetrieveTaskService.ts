import type { Task } from "../models/Task";
import { TaskRepository } from "../../../infra/repositories/TaskRepository";
import { TaskFactory } from './factory/TaskFactory';
import type { ErrorMessage } from "../../../shared/Error";

export const RetrieveTaskService = () => {
    return {
        getAllTasks: async (): Promise<{ tasks: Task[]; error: ErrorMessage | null }> => {
            const { data, error } = await TaskRepository.getAll();

            if (error) return { tasks: [], error };

            return { tasks: data!.map(TaskFactory), error: null };
        },

        getTasks: async (isClosed: boolean): Promise<{ tasks: Task[]; error: ErrorMessage | null }> => {
            const VALID_STATUS_IDS = new Set([1, 2, 3, 4]);

            const cached = sessionStorage.getItem('tasks');
            if (cached) {
                const tasksRetrieving: Task[] = JSON.parse(cached);
                const hasGroupData = tasksRetrieving.length === 0 || tasksRetrieving[0]?.category?.group !== undefined;
                if (hasGroupData) {
                    const taskFilter = tasksRetrieving.filter(task => VALID_STATUS_IDS.has(task.status.id!));
                    return { tasks: taskFilter, error: null };
                }
                sessionStorage.removeItem('tasks');
            }

            const statusIds = isClosed ? [5, 6] : [1, 2, 3, 4];
            const { data, error } = await TaskRepository.getByStatuses(statusIds);

            if (error) return { tasks: [], error };

            const tasks: Task[] = data!.map(TaskFactory);
            sessionStorage.setItem('tasks', JSON.stringify(tasks));

            return { tasks, error: null };
        },

        removeTasksFromStorage: () => {
            sessionStorage.removeItem('tasks');
        }
    };
};
