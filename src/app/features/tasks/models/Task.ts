import type { Category } from "../../../core/models/Category";
import type { Status } from "../../../core/models/Status";
import type { Priority } from "./Priority";

export interface Task {
    id?: string;
    title: string;
    description: string;
    status?: Status;
    category?: Category;
    points: number;
    priority?: Priority;
    createdAt?: Date;
    updatedAt?: Date;
}