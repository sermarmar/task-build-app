import { supabase } from "../../../../config/Database";
import type { Task } from "../models/Task";
import type { TaskResponse } from "../resource/TaskResponse";

export const CreateTaskService = {

    create: async (task: TaskResponse): Promise<{taskCreated: Task | null, error: any}> => {
        const {data, error} = await supabase.from('tasks').insert([task]).select('*').single();

        if (error) {
            return { taskCreated: null, error };
        }

        if (sessionStorage.getItem('tasks')) {
            const tasks: Task[] = JSON.parse(sessionStorage.getItem('tasks')!);
            tasks.push(data);
            sessionStorage.setItem('tasks', JSON.stringify(tasks));
        }

        return { taskCreated: data, error: null };
    }

}