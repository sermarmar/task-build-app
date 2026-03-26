export interface HabitLog {
    id: string;
    habitId: string;
    userId: string;
    completedAt: Date;
    note?: string;
}