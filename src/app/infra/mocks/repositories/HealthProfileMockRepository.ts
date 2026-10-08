import type { HealthProfileEntity } from '@/app/infra/entities/HealthProfileEntity';
import { mockDb } from '@/app/infra/mocks/mockDb';

export const HealthProfileMockRepository = {

    getByUserId: async (userId: string) => {
        // Las sesiones abiertas antes de existir esta tabla no la tienen en el mock persistido
        const row = (mockDb.read().healthProfiles ?? []).find(p => p.user_id === userId) ?? null;
        return { healthProfile: row, error: null };
    },

    upsert: async (entity: HealthProfileEntity) => {
        const db = mockDb.read();
        const profiles = db.healthProfiles ?? [];
        const existing = profiles.find(p => p.user_id === entity.user_id);
        const row: HealthProfileEntity = { ...existing, ...entity, created_at: existing?.created_at ?? new Date().toISOString() };

        db.healthProfiles = [...profiles.filter(p => p.user_id !== entity.user_id), row];
        mockDb.write(db);
        return { healthProfile: row, error: null };
    },

};
