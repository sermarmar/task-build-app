import { supabase } from "../../../config/Database";
import type { Habit } from "../../features/habits/models/Habit";

export const HabitRepository = {

    getHabitsByDays: async (days: string[]): Promise<{habits: Habit[], error: any}> => {
        let query = supabase
            .from('habits')
            .select('*, categories:category_id (*)');

        if (days.length > 0) {
            query = query.or(`custom_days.ov.{${days.join(',')}}, frequency.eq.daily`);
        }

        const { data, error } = await query;

        if (error) {
            return { habits: [], error: 'No se pudieron recuperar los hábitos' };
        }

        return { habits: data, error: null };
    },

    create: async (habit: Habit): Promise<{habitCreated: Habit | null, error: any}> => {
        const {data, error} = await supabase
            .from('habits')
            .insert([habit])
            .select('*, categories:category_id (*)')
            .single();

        if (error) {
            return { habitCreated: null, error };
        }

        return { habitCreated: data, error: null };
    }

}