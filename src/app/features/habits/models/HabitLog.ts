import type { Category } from "../../../core/models/Category";

export interface HabitLog {
    id: string;
    habit_id: string;
    user_id: string;
    completed_at: Date;
    note?: string;
    habits: {
        id: string;
        name: string;
        description?: string;
        categories?: Category | Category[] | null;
        points: number;
    };
}