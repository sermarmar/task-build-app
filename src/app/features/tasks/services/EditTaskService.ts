import { TaskRepository } from "../../../infra/repositories/TaskRepository";
import { TaskFactory } from "./factory/TaskFactory";
import type { ErrorMessage } from "../../../shared/Error";
import type { Task } from "../models/Task";
import type { TaskResponse } from "../resource/TaskResponse";

export const EditTaskService = {

    update: async (taskId: string, task: TaskResponse): Promise<{ taskUpdated: Task | null; error: ErrorMessage | null }> => {
        const { data, error } = await TaskRepository.update(taskId, task);

        if (error) return { taskUpdated: null, error };

        const taskUpdated = TaskFactory(data!);

        const cached = sessionStorage.getItem('tasks');
        if (cached) {
            const tasks: Task[] = JSON.parse(cached);
            sessionStorage.setItem('tasks', JSON.stringify(
                tasks.map(t => t.id === taskId ? taskUpdated : t)
            ));
        }

        return { taskUpdated, error: null };
    }

}
