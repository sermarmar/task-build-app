import { supabase } from "../../../config/Database";
import type { HabitLog } from "../../features/habits/models/HabitLog";
import type { ErrorMessage } from "../../shared/Error";

export const HabitLogRepository = {

    getByHabitIdAndDate: async (habitId: string, date: string): Promise<{ habitLogs: HabitLog[] | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('habit_id', habitId)
            .eq('completed_at', date);

        if (error) {
            return { habitLogs: null, error: { message: 'No se pudieron obtener los registros del hábito' } };
        }

        return { habitLogs: data, error: null };
    },

    getByDate: async (date: string): Promise<{ habitLogs: HabitLog[] | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('completed_at', date);

        if (error) {
            return { habitLogs: null, error: { message: 'No se pudieron obtener los registros del hábito' } };
        }

        return { habitLogs: data, error: null };
    },

    create: async (habitId: string, userId: string, date: string): Promise<{ habitLog: HabitLog | null; error: ErrorMessage | null }> => {
        
        const { data, error } = await supabase
            .from('habit_logs')
            .insert([{ habit_id: habitId, user_id: userId, completed_at: date }])
            .select('*')
            .single();

        if (error) {
            return { habitLog: null, error: { message: 'No se pudo crear el hábito' } };
        }

        return { habitLog: data, error: null };

    },

    delete: async (habitLogId: string): Promise<{ success: boolean; error: ErrorMessage | null }> => {
        
        const { error } = await supabase
            .from('habit_logs')
            .delete()
            .eq('id', habitLogId);

        if (error) {
            return { success: false, error: { message: 'No se pudo eliminar el registro del hábito' } };
        }

        return { success: true, error: null };

    }

};