import type { Category } from '@/app/core/models/Category';
import type { Status } from '@/app/core/models/Status';
import type { Group } from '@/app/features/group/models/Group';
import type { HabitEntity } from '@/app/infra/entities/HabitEntity';
import type { TaskEntity } from '@/app/infra/entities/TaskEntity';
import { createSeed } from '@/app/infra/mocks/mockSeed';

export type GroupRow = Omit<Group, 'categories'>;
export type CategoryRow = Omit<Category, 'group'>;
export type TaskRow = Omit<TaskEntity, 'categories' | 'statuses'>;
export type HabitRow = Omit<HabitEntity, 'categories'>;

export interface HabitLogRow {
    id: string;
    habit_id: string;
    user_id: string;
    completed_at: string;
    created_at: string;
}

export interface MockDb {
    groups: GroupRow[];
    categories: CategoryRow[];
    statuses: Status[];
    tasks: TaskRow[];
    habits: HabitRow[];
    habitLogs: HabitLogRow[];
}

const STORAGE_KEY = 'mock_db';

// Persistido en sessionStorage para que viva lo mismo que las cachés de los servicios (el logout lo resetea)
export const mockDb = {
    read: (): MockDb => {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(createSeed()));
        }
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY)!);
    },

    write: (db: MockDb) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    },
};

// crypto.randomUUID solo existe en contextos seguros y la app se abre por IP local (http) desde el móvil
export const mockId = (): string =>
    `mock-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const findCategoryWithGroup = (db: MockDb, categoryId: string | null) => {
    const category = db.categories.find(c => c.id === categoryId);
    if (!category) return undefined;

    const group = db.groups.find(g => g.id === category.group_id);
    return { ...category, group: group ?? undefined };
};
