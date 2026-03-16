import type { Priority } from "./Priority";
import type { Status } from "./Status";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    category: string;
    points: number;
    priority: Priority;
    createdAt: Date;
    updatedAt: Date;
}