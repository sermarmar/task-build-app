import { supabase } from '../../../config/Database';
import type { ErrorMessage } from '../../shared/Error';
import { USE_MOCKS } from '@/config/env';
import { MapActivitiesMockRepository } from '@/app/infra/mocks/repositories/MapActivitiesMockRepository';

interface RawDateLog {
    completed_at: string;
}

type ActivityCategory = { icon: string; group: { color: string } | null } | null;

export interface RecentHabitLogRow {
    id: string;
    completed_at: string;
    habits: { title: string; categories: ActivityCategory } | null;
}

export interface RecentTaskRow {
    id: string;
    title: string;
    completed_at: string;
    categories: ActivityCategory;
}

const MapActivitiesSupabaseRepository = {
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

    getRecentHabitLogs: async (limit: number): Promise<{ data: RecentHabitLogRow[] | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('habit_logs')
            .select('id, completed_at, habits:habit_id (title, categories:category_id (icon, group:group_id (color)))')
            .order('completed_at', { ascending: false })
            .limit(limit);

        if (error) {
            return { data: null, error: { message: 'No se pudo obtener la actividad reciente' } };
        }

        return { data: data as unknown as RecentHabitLogRow[], error: null };
    },

    getRecentCompletedTasks: async (limit: number): Promise<{ data: RecentTaskRow[] | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('tasks')
            .select('id, title, completed_at, categories:category_id (icon, group:group_id (color))')
            .eq('status_id', 5)
            .not('completed_at', 'is', null)
            .order('completed_at', { ascending: false })
            .limit(limit);

        if (error) {
            return { data: null, error: { message: 'No se pudo obtener la actividad reciente' } };
        }

        return { data: data as unknown as RecentTaskRow[], error: null };
    },
};

export const MapActivitiesRepository: typeof MapActivitiesSupabaseRepository = USE_MOCKS ? MapActivitiesMockRepository : MapActivitiesSupabaseRepository;
