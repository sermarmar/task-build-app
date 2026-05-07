import { supabase } from "../../../config/Database";
import type { Habit } from "../../features/habits/models/Habit";
import type { HabitEntity } from "../entities/HabitEntity";
import { HabitFactory } from "../../features/habits/services/factory/HabitFactory";
import type { ErrorMessage } from "../../shared/Error";

export const HabitRepository = {

    getHabitsByDays: async (days?: string[]): Promise<{ habits: Habit[]; error: ErrorMessage | null }> => {
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

    update: async (id: string, updates: Partial<Omit<Habit, 'id' | 'current_streak' | 'categories'>>): Promise<{ habitUpdated: Habit | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('habits')
            .update(updates)
            .eq('id', id)
            .select('*, categories:category_id (*, group:group_id (*))')
            .single();

        if (error) {
            return { habitUpdated: null, error: { message: 'No se pudo actualizar el hábito' } };
        }

        return { habitUpdated: HabitFactory.mapFromEntity(data as HabitEntity), error: null };
    },

    delete: async (id: string): Promise<{ error: ErrorMessage | null }> => {
        const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', id);

        if (error) {
            return { error: { message: 'No se pudo eliminar el hábito' } };
        }

        return { error: null };
    },

}
