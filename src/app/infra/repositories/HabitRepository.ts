import { supabase } from "../../../config/Database";
import type { Habit } from "../../features/habits/models/Habit";
import type { HabitEntity } from "../entities/HabitEntity";
import { HabitFactory } from "../../features/habits/services/factory/HabitFactory";
import type { ErrorMessage } from "../../shared/Error";

export const HabitRepository = {

    getHabitsByDays: async (days?: number[]): Promise<{ habits: Habit[]; error: ErrorMessage | null }> => {
        let query = supabase
            .from('habits')
            .select('*, categories:category_id (*, group:group_id (*))');

        if (days && days.length > 0) {
            query = query.or(`custom_days.ov.{${days.join(',')}}, frequency.eq.daily`);
        }

        const { data, error } = await query;

        if (error) {
            return { habits: [], error: { message: 'No se pudieron recuperar los hábitos' } };
        }

        return { habits: (data as HabitEntity[]).map(HabitFactory.mapFromEntity), error: null };
    },

    create: async (habit: Omit<Habit, 'id' | 'current_streak' | 'categories'>): Promise<{ habitCreated: Habit | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('habits')
            .insert([habit])
            .select('*, categories:category_id (*, group:group_id (*))')
            .single();

        if (error) {
            return { habitCreated: null, error: { message: 'No se pudo crear el hábito' } };
        }

        return { habitCreated: HabitFactory.mapFromEntity(data as HabitEntity), error: null };
    },

}
