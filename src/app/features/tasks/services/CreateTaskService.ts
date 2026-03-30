import { TaskRepository } from "../../../infra/repositories/TaskRepository";
import type { Task } from "../models/Task";
import type { TaskResponse } from "../resource/TaskResponse";
import { TaskFactory } from "./factory/TaskFactory";

export const CreateTaskService = {

    create: async (task: TaskResponse): Promise<{taskCreated: Task | null, error: any}> => {
        const { taskCreated, error } = await TaskRepository.create(task);

        if (error) {
            return { taskCreated: null, error };
        }

        if (sessionStorage.getItem('tasks')) {
            const tasks: Task[] = JSON.parse(sessionStorage.getItem('tasks')!);
            tasks.push(TaskFactory(taskCreated!));
            sessionStorage.setItem('tasks', JSON.stringify(tasks));
        }

        return { taskCreated, error: null };
        
    }

}