import { supabase } from "../../../../config/Database";
import type { Task } from "../models/Task";
import type { TaskResponse } from "../resource/TaskResponse";

export const CreateTaskService = {

    create: async (task: TaskResponse): Promise<{taskCreated: Task | null, error: any}> => {
        const {data, error} = await supabase.from('tasks').insert([task]).select('*').single();

        if (error) {
            return {taskCreated: null, error};
        }

        return {taskCreated: data, error: null};
    }

}