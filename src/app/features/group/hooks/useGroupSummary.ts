import { useEffect, useState } from "react";
import { RetrieveGroupSummaryService, type GroupSummary } from "../services/RetrieveGroupSummaryService";

interface UseGroupSummaryResult {
    groups: GroupSummary[];
    isLoading: boolean;
}

export const useGroupSummary = (): UseGroupSummaryResult => {
    const [groups, setGroups] = useState<GroupSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        RetrieveGroupSummaryService.getSummary().then(({ groups }) => {
            setGroups(groups);
            setIsLoading(false);
        });
    }, []);

    return { groups, isLoading };
};
