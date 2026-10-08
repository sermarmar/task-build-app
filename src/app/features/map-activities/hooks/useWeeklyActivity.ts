import { useEffect, useState } from "react";
import { RetrieveWeeklyActivityService, type WeeklyActivity } from "../services/RetrieveWeeklyActivityService";
import { usePageLoading } from "@/app/contexts/page-loading/usePageLoading";

interface UseWeeklyActivityResult {
    weekly: WeeklyActivity | null;
    isLoading: boolean;
}

export const useWeeklyActivity = (): UseWeeklyActivityResult => {
    const [weekly, setWeekly] = useState<WeeklyActivity | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        RetrieveWeeklyActivityService.getWeeklyActivity().then(({ weekly }) => {
            setWeekly(weekly);
            setIsLoading(false);
        });
    }, []);

    const pageLoading = usePageLoading(isLoading);

    return { weekly, isLoading: pageLoading };
};
