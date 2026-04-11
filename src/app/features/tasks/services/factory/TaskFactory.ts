import type { Category } from '../../../../core/models/Category';
import type { Status } from '../../../../core/models/Status';
import { type Task } from '../../models/Task';

export const TaskFactory = (data: Partial<Task>): Task => {
    return {
        id: data.id || '', 
        title: data.title || '',
        description: data.description || '',
        status: data.statuses as Status,
        category: data.categories as Category,
        points: data.points || 0,
        priority: data.priority,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
}