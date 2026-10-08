import { supabase } from "../../../config/Database";
import type { ErrorMessage } from "../../shared/Error";
import type { HealthProfileEntity } from "../entities/HealthProfileEntity";
import { USE_MOCKS } from '@/config/env';
import { HealthProfileMockRepository } from '@/app/infra/mocks/repositories/HealthProfileMockRepository';

const HealthProfileSupabaseRepository = {

    getByUserId: async (userId: string): Promise<{ healthProfile: HealthProfileEntity | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('health_profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            return { healthProfile: null, error: { message: 'No se pudieron obtener tus datos de salud' } };
        }

        return { healthProfile: data, error: null };
    },

    upsert: async (entity: HealthProfileEntity): Promise<{ healthProfile: HealthProfileEntity | null; error: ErrorMessage | null }> => {
        const { data, error } = await supabase
            .from('health_profiles')
            .upsert(entity, { onConflict: 'user_id' })
            .select('*')
            .single();

        if (error) {
            return { healthProfile: null, error: { message: 'No se pudieron guardar tus datos de salud' } };
        }

        return { healthProfile: data, error: null };
    },

}

export const HealthProfileRepository: typeof HealthProfileSupabaseRepository = USE_MOCKS ? HealthProfileMockRepository : HealthProfileSupabaseRepository;
