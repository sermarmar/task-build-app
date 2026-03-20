import { supabase } from "../../../../config/Database";
import type { Task } from "../models/Task";

export const UpdateTaskService = {

    updateByStatus: async (taskId: string, statusId: number): Promise<{taskUpdated: Task | null, error: any}> => {
        const {data, error} = await supabase.from('tasks').update({status_id: statusId}).eq('id', taskId).select('*').single();

        if (error) {
            return {taskUpdated: null, error};
        }

        return {taskUpdated: data, error: null};
    }

}