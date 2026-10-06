import type { Habit } from '@/app/features/habits/models/Habit';
import { HabitFactory } from '@/app/features/habits/services/factory/HabitFactory';
import type { HabitEntity } from '@/app/infra/entities/HabitEntity';
import { findCategoryWithGroup, mockDb, mockId, type HabitRow, type MockDb } from '@/app/infra/mocks/mockDb';

type HabitInput = Omit<Habit, 'id' | 'current_streak' | 'categories'>;

const toHabit = (db: MockDb, habit: HabitRow): Habit => {
    const entity: HabitEntity = { ...habit, categories: findCategoryWithGroup(db, habit.category_id) ?? null };
    return HabitFactory.mapFromEntity(entity);
};

export const HabitMockRepository = {

    getHabitsByDays: async (days?: string[]) => {
        const db = mockDb.read();
        const habits = db.habits.filter(h =>
            !days?.length ||
            h.frequency === 'daily' ||
            (h.custom_days ?? []).some(day => days.includes(day))
        );
        return { habits: habits.map(h => toHabit(db, h)), error: null };
    },

    create: async (habit: HabitInput) => {
        const db = mockDb.read();
        const now = new Date().toISOString();
        const row: HabitRow = { ...habit, id: mockId(), current_streak: 0, created_at: now, updated_at: now };

        db.habits.push(row);
        mockDb.write(db);
        return { habitCreated: toHabit(db, row), error: null };
    },

    update: async (id: string, updates: Partial<HabitInput>) => {
        const db = mockDb.read();
        const habit = db.habits.find(h => h.id === id);
        if (!habit) return { habitUpdated: null, error: { message: 'No se pudo actualizar el hábito' } };

        Object.assign(habit, updates, { updated_at: new Date().toISOString() });
        mockDb.write(db);
        return { habitUpdated: toHabit(db, habit), error: null };
    },

    delete: async (id: string) => {
        const db = mockDb.read();
        db.habits = db.habits.filter(h => h.id !== id);
        db.habitLogs = db.habitLogs.filter(log => log.habit_id !== id);
        mockDb.write(db);
        return { error: null };
    },

};
