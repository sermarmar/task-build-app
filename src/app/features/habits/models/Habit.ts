import type { Category } from "../../../core/models/Category";
import type { HabitLog } from "./HabitLog";

export interface Habit {
    id?: string;
    user_id?: string;
    title: string;
    description?: string;
    category_id?: string | null;
    categories?: Category | Category[] | null;
    points: number;
    frequency: string;
    custom_days?: string[];
    current_streak?: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
    habit_logs?: HabitLog[];
}