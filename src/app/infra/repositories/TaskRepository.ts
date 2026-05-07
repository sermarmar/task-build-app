import { supabase } from "../../../config/Database";
import type { TaskEntity } from "../entities/TaskEntity";
import type { TaskResponse } from "../../features/tasks/resource/TaskResponse";
import type { ErrorMessage } from "../../shared/Error";

const TASK_SELECT = '*, categories:category_id (*, group:group_id (*)), statuses:status_id (*)';

export const TaskRepository = {

    getAll: async (): Promise<{ data: TaskEntity[] | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase.from('tasks').select(TASK_SELECT);

        if (error) return { data: null, error: { message: 'No se pudieron recuperar las tareas' } };
        return { data, error: null };
    },

    getByStatuses: async (statusIds: number[]): Promise<{ data: TaskEntity[] | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('tasks')
            .select(TASK_SELECT)
            .in('status_id', statusIds);

        if (error) return { data: null, error: { message: 'No se pudieron recuperar las tareas' } };
        return { data, error: null };
    },

    getCompletedInCurrentMonth: async (): Promise<{ data: TaskEntity[] | null; error: ErrorMessage | null }> => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

        const { data, error } = await supabase
            .from('tasks')
            .select(TASK_SELECT)
            .eq('status_id', 5)
            .gte('updated_at', firstDay)
            .lte('updated_at', lastDay);

        if (error) return { data: null, error: { message: 'No se pudieron obtener las tareas' } };
        return { data, error: null };
    },

    create: async (task: TaskResponse): Promise<{ data: TaskEntity | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([task])
            .select(TASK_SELECT)
            .single();

        if (error) return { data: null, error: { message: 'No se pudo crear la tarea' } };
        return { data, error: null };
    },

    updateByStatus: async (taskId: string, statusId: number): Promise<{ data: TaskEntity | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('tasks')
            .update({ status_id: statusId })
            .eq('id', taskId)
            .select(TASK_SELECT)
            .single();

        if (error) return { data: null, error: { message: 'No se pudo actualizar la tarea' } };
        return { data, error: null };
    },

    update: async (taskId: string, task: TaskResponse): Promise<{ data: TaskEntity | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('tasks')
            .update(task)
            .eq('id', taskId)
            .select(TASK_SELECT)
            .single();

        if (error) return { data: null, error: { message: 'No se pudo actualizar la tarea' } };
        return { data, error: null };
    },

    delete: async (taskId: string): Promise<{ error: ErrorMessage | null }> => {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId);

        if (error) return { error: { message: 'No se pudo eliminar la tarea' } };
        return { error: null };
    },

}
