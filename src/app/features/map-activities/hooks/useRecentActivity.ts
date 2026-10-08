import { useEffect, useState } from "react";
import { RetrieveRecentActivityService, type RecentActivityItem } from "../services/RetrieveRecentActivityService";
import { usePageLoading } from "@/app/contexts/page-loading/usePageLoading";

interface UseRecentActivityResult {
    items: RecentActivityItem[];
    isLoading: boolean;
}

export const useRecentActivity = (): UseRecentActivityResult => {
    const [items, setItems] = useState<RecentActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        RetrieveRecentActivityService.getRecentActivity().then(({ items }) => {
            setItems(items);
            setIsLoading(false);
        });
    }, []);

    const pageLoading = usePageLoading(isLoading);

    return { items, isLoading: pageLoading };
};
