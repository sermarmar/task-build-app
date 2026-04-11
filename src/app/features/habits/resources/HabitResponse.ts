import type { Category } from "../../../core/models/Category";

export interface HabitResponse {
    id: string;
    title: string;
    category: Category;
    points: number;
    frequency: string;
    custom_days?: string[];
    current_streak?: number;
    is_active: boolean;
}