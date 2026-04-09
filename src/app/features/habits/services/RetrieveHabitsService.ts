import { HabitRepository } from "../../../infra/repositories/HabitRepository";
import type { ErrorMessage } from "../../../shared/Error";
import type { Habit } from "../models/Habit";

export const RetrieveHabitsService = {

    getHabits: async (days: string[]): Promise<{habits: Habit[], error: ErrorMessage | null}> => {
        if(sessionStorage.getItem('habits') && sessionStorage.getItem('habits') !== '[]') {
            const habitsRetrieving: Habit[] = JSON.parse(sessionStorage.getItem('habits')!);
            return { habits: habitsRetrieving, error: null}
        } else {
            const { habits, error } = await HabitRepository.getHabitsByDays(days);

            if(error) {
                return { habits: [], error };
            }

            sessionStorage.setItem('habits', JSON.stringify(habits));

            return { habits: habits, error: null };
        }
    },

    removeHabitsFromStorage: () => {
        sessionStorage.removeItem('habits');
    }

};