import { useEffect, useState } from "react";
import { RetrieveGroupSummaryService, type GroupSummary } from "../services/RetrieveGroupSummaryService";
import { usePageLoading } from "@/app/contexts/page-loading/usePageLoading";

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

    const pageLoading = usePageLoading(isLoading);

    return { groups, isLoading: pageLoading };
};
