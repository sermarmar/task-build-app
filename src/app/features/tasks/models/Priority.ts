export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Priority {
    id: PriorityLevel;
    name: string;
    color: string;
}

export const PRIORITY_LEVELS: Priority[] = [
    { id: 'low',    name: 'Baja',  color: '#22c55e' },
    { id: 'medium', name: 'Media', color: '#f59e0b' },
    { id: 'high',   name: 'Alta',  color: '#ef4444' },
];