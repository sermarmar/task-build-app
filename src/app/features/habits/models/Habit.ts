import type { Category } from "../../../core/models/Category";

export interface Habit {
    id?: string;
    user_id?: string;
    title: string;
    description?: string;
    category_id?: string | Category | null;
    points: number;
    frequency: string;
    custom_days?: string[];
    current_streak?: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}