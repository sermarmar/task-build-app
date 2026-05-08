export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface HabitFilters {
    text: string;
    categoryId: string | null;
}

export const DEFAULT_HABIT_FILTERS: HabitFilters = {
    text: '',
    categoryId: null,
};

export interface Habit {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    category_id: string | null;
    points: number;
    frequency: HabitFrequency;
    custom_days: string[] | null;
    current_streak: number;
    is_active: boolean;
    categories?: {
        id: string;
        name: string;
        icon: string;
        group?: {
            name: string;
            color: string;
        } | null;
    } | null;
}
