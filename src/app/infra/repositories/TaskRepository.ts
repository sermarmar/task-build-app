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
    }

}