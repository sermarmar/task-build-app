import { TaskRepository } from "../../../infra/repositories/TaskRepository";
import { TaskFactory } from "./factory/TaskFactory";
import type { ErrorMessage } from "../../../shared/Error";
import type { Task } from "../models/Task";

export const UpdateTaskService = {

    updateByStatus: async (taskId: string, statusId: number): Promise<{ taskUpdated: Task | null; error: ErrorMessage | null }> => {
        const { data, error } = await TaskRepository.updateByStatus(taskId, statusId);

        if (error) return { taskUpdated: null, error };

        return { taskUpdated: TaskFactory(data!), error: null };
    }

}
