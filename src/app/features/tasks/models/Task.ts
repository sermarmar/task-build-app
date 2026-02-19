export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    priority: string;
    createdAt: Date;
    updatedAt: Date;
}