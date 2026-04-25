import { supabase } from "../../../config/Database";
import type { Task } from "../../features/tasks/models/Task";
import type { TaskResponse } from "../../features/tasks/resource/TaskResponse";
import type { ErrorMessage } from "../../shared/Error";


export const TaskRepository = {

    getTasksCompleted: async (): Promise<{tasks: Task[] | null, error: ErrorMessage | null}> => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

        const { data, error } = await supabase
            .from('tasks')
            .select('*, categories:category_id (*), statuses:status_id (*)')
            .eq('status_id', 5)
            .gte('updated_at', firstDay)
            .lte('updated_at', lastDay);

        if (error) {
            return { tasks: null, error: { message: 'No se pudieron obtener las tareas' } };
        }
        return { tasks: data, error: null };
    },

    create: async (task: TaskResponse): Promise<{taskCreated: Task | null, error: ErrorMessage | null}> => {
        const {data, error} = await supabase
            .from('tasks')
            .insert([task])
            .select('*, categories:category_id (*), statuses:status_id (*)')
            .single();

        if (error) {
            return { taskCreated: null, error: { message: 'No se pudo crear la tarea' } };
        }

        return { taskCreated: data, error: null };
    },

    updateByStatus: async (taskId: string, statusId: number): Promise<{taskUpdated: Task | null, error: ErrorMessage | null}> => {
        const {data, error} = await supabase.from('tasks').update({status_id: statusId}).eq('id', taskId).select('*').single();

        if (error) {
            return {taskUpdated: null, error: { message: 'No se pudo actualizar la tarea' } };
        }

        return {taskUpdated: data, error: null};
    }

}