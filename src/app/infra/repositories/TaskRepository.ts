import { supabase } from "../../../config/Database";
import type { Task } from "../../features/tasks/models/Task";
import type { TaskResponse } from "../../features/tasks/resource/TaskResponse";


export const TaskRepository = {

    create: async (task: TaskResponse): Promise<{taskCreated: Task | null, error: any}> => {
        const {data, error} = await supabase
            .from('tasks')
            .insert([task])
            .select('*, categories:category_id (*), statuses:status_id (*)')
            .single();

        if (error) {
            return { taskCreated: null, error };
        }

        return { taskCreated: data, error: null };
    },

    updateByStatus: async (taskId: string, statusId: number): Promise<{taskUpdated: Task | null, error: any}> => {
        const {data, error} = await supabase.from('tasks').update({status_id: statusId}).eq('id', taskId).select('*').single();

        if (error) {
            return {taskUpdated: null, error};
        }

        return {taskUpdated: data, error: null};
    }

}