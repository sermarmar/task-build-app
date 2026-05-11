import { TaskRepository } from "../../../infra/repositories/TaskRepository";
import type { ErrorMessage } from "../../../shared/Error";
import type { Task } from "../models/Task";

export const DeleteTaskService = {

    delete: async (taskId: string): Promise<{ error: ErrorMessage | null }> => {
        const { error } = await TaskRepository.delete(taskId);

        if (!error) {
            const cached = sessionStorage.getItem('tasks');
            if (cached) {
                const tasks: Task[] = JSON.parse(cached);
                sessionStorage.setItem('tasks', JSON.stringify(tasks.filter(t => t.id !== taskId)));
            }
        }

        return { error };
    }

}
