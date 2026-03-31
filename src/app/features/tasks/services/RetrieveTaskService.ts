import type { Task } from "../models/Task";
import { supabase } from "../../../../config/Database";
import { TaskFactory } from './factory/TaskFactory';

export const RetrieveTaskService = () => {
    return {
        getAllTasks: async (): Promise<{ tasks: Task[]; error: any }> => {
            const { data, error } = await supabase.from('tasks').select('*, categories:category_id (*), statuses:status_id (*)');

            if (error) {
                return { tasks: [], error: 'No se pudieron recuperar las tareas' };
            }

            return { tasks: data, error: null };
        },

        getTasks: async (isClosed: boolean): Promise<{ tasks: Task[]; error: any }> => {

            const VALID_STATUS_IDS = new Set([1, 2, 3, 4]);

            if(sessionStorage.getItem('tasks')) {
                const tasksRetrieving: Task[] = JSON.parse(sessionStorage.getItem('tasks')!);
                const taskFilter = tasksRetrieving.filter(task => VALID_STATUS_IDS.has(task.status.id!));
                return { tasks: taskFilter, error: null}
            } else {
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*, categories:category_id (*), statuses:status_id (*)')
                    .in('status_id', isClosed ? [5, 6] : [1, 2, 3, 4]);

                if (error) {
                    return { tasks: [], error: 'No se pudieron recuperar las tareas' };
                }

                const tasks: Task[] =data.map(TaskFactory);

                sessionStorage.setItem('tasks', JSON.stringify(tasks));

                return { tasks: tasks, error: null };
            }
            
        },

        removeTasksFromStorage: () => {
            sessionStorage.removeItem('tasks');
        }
    };
};