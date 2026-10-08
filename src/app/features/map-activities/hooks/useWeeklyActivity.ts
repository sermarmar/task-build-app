import { useEffect, useState } from "react";
import { RetrieveWeeklyActivityService, type WeeklyActivity } from "../services/RetrieveWeeklyActivityService";

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

    return { weekly, isLoading };
};
