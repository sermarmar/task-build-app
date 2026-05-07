import type { Category } from '../../core/models/Category';
import type { Status } from '../../core/models/Status';
import type { Priority } from '../../features/tasks/models/Priority';

export interface TaskEntity {
    id: string;
    title: string;
    description: string;
    points: number;
    category_id: string;
    status_id: number;
    priority?: Priority;
    created_at?: string;
    updated_at?: string;
    categories?: Category;
    statuses?: Status;
}
