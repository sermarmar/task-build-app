import type { HabitLog } from '@/app/features/habits/models/HabitLog';
import { mockDb, mockId, type HabitLogRow, type MockDb } from '@/app/infra/mocks/mockDb';

// Como en Supabase, las filas llevan la fecha como string 'YYYY-MM-DD' aunque el modelo diga Date
const toHabitLog = (log: HabitLogRow) => log as unknown as HabitLog;

const withHabit = (db: MockDb, log: HabitLogRow) => {
    const habit = db.habits.find(h => h.id === log.habit_id);
    const categories = db.categories.find(c => c.id === habit?.category_id) ?? null;
    return { ...log, habits: habit ? { ...habit, categories } : null } as unknown as HabitLog;
};

const currentMonthPrefix = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const HabitLogMockRepository = {

    getByHabitIdAndDate: async (habitId: string, date: string) => {
        const logs = mockDb.read().habitLogs.filter(log => log.habit_id === habitId && log.completed_at === date);
        return { habitLogs: logs.map(toHabitLog), error: null };
    },

    getByDate: async (date: string) => {
        const logs = mockDb.read().habitLogs.filter(log => log.completed_at === date);
        return { habitLogs: logs.map(toHabitLog), error: null };
    },

    getHabitsCompleted: async () => {
        const db = mockDb.read();
        const logs = db.habitLogs.filter(log => log.completed_at.startsWith(currentMonthPrefix()));
        return { habitLogs: logs.map(log => withHabit(db, log)), error: null };
    },

    create: async (habitId: string, userId: string, date: string) => {
        const db = mockDb.read();
        // Índice único (habit_id, completed_at) como en la tabla real
        if (db.habitLogs.some(log => log.habit_id === habitId && log.completed_at === date)) {
            return { habitLog: null, error: { message: 'No se pudo crear el hábito' } };
        }

        const row: HabitLogRow = { id: mockId(), habit_id: habitId, user_id: userId, completed_at: date, created_at: new Date().toISOString() };
        db.habitLogs.push(row);
        mockDb.write(db);
        return { habitLog: toHabitLog(row), error: null };
    },

    delete: async (habitLogId: string) => {
        const db = mockDb.read();
        db.habitLogs = db.habitLogs.filter(log => log.id !== habitLogId);
        mockDb.write(db);
        return { success: true, error: null };
    },

};
