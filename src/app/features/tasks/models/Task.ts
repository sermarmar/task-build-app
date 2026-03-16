import type { Priority } from "./Priority";

export interface Task {
    id?: string;
    title: string;
    description: string;
    status_id: string;
    category_id: string;
    points: number;
    priority?: Priority;
    createdAt?: Date;
    updatedAt?: Date;
}