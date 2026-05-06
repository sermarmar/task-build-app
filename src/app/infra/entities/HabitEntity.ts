export interface HabitEntity {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    category_id: string | null;
    points: number;
    frequency: 'daily' | 'weekly' | 'custom';
    custom_days: string[] | null;
    current_streak: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    categories?: {
        id: string;
        name: string;
        description: string | null;
        icon: string;
        group_id: string | null;
        group?: {
            id: string;
            name: string;
            color: string;
        } | null;
        created_at: string;
    } | null;
}
