import { supabase } from "../../../../config/Database";
import type { ErrorMessage } from "../../../shared/Error";
import type { Task } from "../models/Task";

export const UpdateTaskService = {

    updateByStatus: async (taskId: string, statusId: number): Promise<{taskUpdated: Task | null, error: ErrorMessage | null}> => {
        const {data, error} = await supabase.from('tasks').update({status_id: statusId}).eq('id', taskId).select('*').single();

        if (error) {
            return {taskUpdated: null, error: { message: 'No se pudo actualizar la tarea' } };
        }

        return {taskUpdated: data, error: null};
    }

}