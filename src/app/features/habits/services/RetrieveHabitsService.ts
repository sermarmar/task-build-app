import { HabitRepository } from "../../../infra/repositories/HabitRepository";
import type { ErrorMessage } from "../../../shared/Error";
import type { Habit, HabitFilters } from "../models/Habit";

export const filterHabits = (habits: Habit[], filters: HabitFilters): Habit[] =>
    habits.filter(habit => {
        if (filters.text && !habit.title.toLowerCase().includes(filters.text.toLowerCase())) return false;
        if (filters.categoryId !== null && habit.category_id !== filters.categoryId) return false;
        return true;
    });

const HABITS_CACHE_PREFIX = 'habits_';

export const RetrieveHabitsService = {

    getHabits: async (days: string[]): Promise<{habits: Habit[], error: ErrorMessage | null}> => {
        const weekday = days[0];
        const cacheKey = `${HABITS_CACHE_PREFIX}${weekday}`;
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            return { habits: JSON.parse(cached), error: null };
        }

        const { habits, error } = await HabitRepository.getHabitsByDays(days);

        if (error) {
            return { habits: [], error };
        }

        sessionStorage.setItem(cacheKey, JSON.stringify(habits));
        return { habits, error: null };
    },

    removeHabitsFromStorage: () => {
        Object.keys(sessionStorage)
            .filter(key => key.startsWith(HABITS_CACHE_PREFIX))
            .forEach(key => sessionStorage.removeItem(key));
    }

};
