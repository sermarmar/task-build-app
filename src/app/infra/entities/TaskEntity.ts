import type { Category } from '../../core/models/Category';
import type { Status } from '../../core/models/Status';
export interface TaskEntity {
    id: string;
    title: string;
    description: string;
    points: number;
    category_id: string;
    status_id: number;
    priority?: string;
    created_at?: string;
    updated_at?: string;
    completed_at?: string | null;
    categories?: Category;
    statuses?: Status;
}
