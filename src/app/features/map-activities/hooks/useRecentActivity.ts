import { useEffect, useState } from "react";
import { RetrieveRecentActivityService, type RecentActivityItem } from "../services/RetrieveRecentActivityService";

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

    return { items, isLoading };
};
