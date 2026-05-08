import type { Task, TaskFilters } from "../models/Task";
import { TaskRepository } from "../../../infra/repositories/TaskRepository";
import { TaskFactory } from './factory/TaskFactory';
import type { ErrorMessage } from "../../../shared/Error";

export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] =>
    tasks.filter(task => {
        if (filters.text && !task.title.toLowerCase().includes(filters.text.toLowerCase())) return false;
        if (filters.statusId !== null && task.status?.id !== filters.statusId) return false;
        if (filters.categoryId !== null && task.category?.id !== filters.categoryId) return false;
        return true;
    });

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
