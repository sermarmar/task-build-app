export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Priority {
    id: PriorityLevel;
    name: string;
    color: string;
}

export const PRIORITY_LEVELS: Priority[] = [
    { id: 'low',    name: 'Baja',  color: '#6fa892' },
    { id: 'medium', name: 'Media', color: '#d9a35a' },
    { id: 'high',   name: 'Alta',  color: '#d46f68' },
];