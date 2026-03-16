import { supabase } from "../../../../config/Database";
import type { Task } from "../models/Task";

export const CreateTaskService = {

    create: async (task: Task): Promise<{taskCreated: Task | null, error: any}> => {
        const {data, error} = await supabase.from('tasks').insert([task]).select('*').single();

        if (error) {
            return {taskCreated: null, error};
        }

        return {taskCreated: data, error: null};
    }

}