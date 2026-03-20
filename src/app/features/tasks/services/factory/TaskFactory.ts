import { type Task } from '../../models/Task';

export const TaskFactory = (data: Partial<Task>): Task => {
    return {
        title: data.title || '',
        description: data.description || '',
        status: data.statuses,
        category: data.categories,
        points: data.points || 0,
        priority: data.priority,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
}