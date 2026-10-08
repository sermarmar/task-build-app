import { useEffect, useState } from "react";
import type { ErrorMessage } from "@/app/shared/Error";
import { EMPTY_HEALTH_PROFILE, type HealthProfile } from "../models/HealthProfile";
import { RetrieveHealthProfileService } from "../services/RetrieveHealthProfileService";
import { SaveHealthProfileService } from "../services/SaveHealthProfileService";
import { usePageLoading } from "@/app/contexts/page-loading/usePageLoading";

interface UseHealthProfileResult {
    profile: HealthProfile;
    isLoading: boolean;
    isSaving: boolean;
    error: ErrorMessage | null;
    save: (values: HealthProfile) => Promise<{ error: ErrorMessage | null }>;
}

export const useHealthProfile = (userId?: string): UseHealthProfileResult => {
    const [profile, setProfile] = useState<HealthProfile>(EMPTY_HEALTH_PROFILE);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<ErrorMessage | null>(null);

    useEffect(() => {
        if (!userId) return;
        RetrieveHealthProfileService.get(userId).then(({ profile, error }) => {
            if (profile) setProfile(profile);
            setError(error);
            setIsLoading(false);
        });
    }, [userId]);

    const save = async (values: HealthProfile) => {
        if (!userId) return { error: { message: 'No hay sesión activa' } };
        setIsSaving(true);
        const { profile: saved, error } = await SaveHealthProfileService.save(userId, values);
        setIsSaving(false);
        if (saved) setProfile(saved);
        return { error };
    };

    const pageLoading = usePageLoading(isLoading);

    return { profile, isLoading: pageLoading, isSaving, error, save };
};
