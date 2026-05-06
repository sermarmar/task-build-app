export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    group_id: string | null;
    group?: { name: string; color: string };
    created_at: string;
}