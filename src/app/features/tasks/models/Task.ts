import type { Priority } from "./Priority";
import type { Status } from "./Status";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    category: string;
    priority: Priority;
    createdAt: Date;
    updatedAt: Date;
}