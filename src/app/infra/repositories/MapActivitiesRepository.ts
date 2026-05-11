import { supabase } from '../../../config/Database';
import type { ErrorMessage } from '../../shared/Error';

interface RawDateLog {
    completed_at: string;
}

export const MapActivitiesRepository = {
    getHabitLogsByDateRange: async (
        startDate: string,
        endDate: string
    ): Promise<{ data: RawDateLog[] | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('habit_logs')
            .select('completed_at')
            .gte('completed_at', startDate)
            .lte('completed_at', endDate);

        if (error) {
            return { data: null, error: { message: 'No se pudo obtener el historial de hábitos' } };
        }

        return { data, error: null };
    },

    getCompletedTasksByDateRange: async (
        startDate: string,
        endDate: string
    ): Promise<{ data: RawDateLog[] | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('tasks')
            .select('completed_at')
            .eq('status_id', 5)
            .gte('completed_at', startDate)
            .lte('completed_at', endDate);

        if (error) {
            return { data: null, error: { message: 'No se pudo obtener el historial de tareas' } };
        }

        return { data, error: null };
    },
};