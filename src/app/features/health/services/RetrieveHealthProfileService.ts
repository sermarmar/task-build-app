import { HealthProfileRepository } from "@/app/infra/repositories/HealthProfileRepository";
import type { ErrorMessage } from "@/app/shared/Error";
import type { HealthProfile } from "../models/HealthProfile";
import { HealthProfileFactory } from "./factory/HealthProfileFactory";

export const RetrieveHealthProfileService = {

    get: async (userId: string): Promise<{ profile: HealthProfile | null; error: ErrorMessage | null }> => {
        const { healthProfile, error } = await HealthProfileRepository.getByUserId(userId);
        if (error) return { profile: null, error };
        return { profile: HealthProfileFactory.mapFromEntity(healthProfile), error: null };
    },

};
