export type HabitRequest = {
    title: string;
    points: number;
    category_id: string;
    frecuency: string;
    options_weekly?: string[];
    options_monthly?: string[];
};