import type { Category } from "../../../core/models/Category";
import type { Status } from "../../../core/models/Status";
import type { Priority } from "./Priority";

export interface TaskFilters {
    text: string;
    statusId: number | null;
    categoryId: string | null;
}

export const DEFAULT_TASK_FILTERS: TaskFilters = {
    text: '',
    statusId: null,
    categoryId: null,
};

export interface Task {
    id?: string;
    title: string;
    description: string;
    status: Status;
    category: Category;
    statuses?: Status;
    categories?: Category;
    points: number;
    priority?: Priority;
    createdAt?: Date;
    updatedAt?: Date;
}