import { HealthProfileRepository } from "@/app/infra/repositories/HealthProfileRepository";
import type { ErrorMessage } from "@/app/shared/Error";
import type { HealthProfile } from "../models/HealthProfile";
import { HealthProfileFactory } from "./factory/HealthProfileFactory";

export const SaveHealthProfileService = {

    save: async (userId: string, profile: HealthProfile): Promise<{ profile: HealthProfile | null; error: ErrorMessage | null }> => {
        const { healthProfile, error } = await HealthProfileRepository.upsert(HealthProfileFactory.mapToEntity(userId, profile));
        if (error) return { profile: null, error };
        return { profile: HealthProfileFactory.mapFromEntity(healthProfile), error: null };
    },

};
