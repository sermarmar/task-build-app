import { TaskEntity } from '@/app/infra/entities/TaskEntity';
import { Task } from '../../models/Task';
import { PRIORITY_LEVELS } from '../../models/Priority';

export const TaskFactory = (data: TaskEntity): Task => {
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.statuses!,
        category: data.categories!,
        points: data.points,
        priority: PRIORITY_LEVELS.find(p => p.id === data.priority),
        createdAt: data.created_at ? new Date(data.created_at) : undefined,
        updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
}
