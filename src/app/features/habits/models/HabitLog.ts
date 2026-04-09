export interface HabitLog {
    id: string;
    habit_id: string;
    user_id: string;
    completed_at: Date;
    note?: string;
}