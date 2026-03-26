import type { Category } from "../../../core/models/Category";

export interface Habit {
    id?: string;
    title: string;
    description: string;
    category?: Category;
    points: number;
    frecuency?: string;
    customDays?: number[];
    currentStreak?: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}