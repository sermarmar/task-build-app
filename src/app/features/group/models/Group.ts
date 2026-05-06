export interface Group {
    id: string;
    name: string;
    color: string;
    created_at: string;
    categories?: { id: string; name: string; icon: string }[];
}