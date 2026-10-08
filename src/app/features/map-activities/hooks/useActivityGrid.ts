import { useEffect, useState } from "react";
import { RetrieveMapActivitiesService } from "../services/RetrieveMapActivitiesService";
import type { ActivityGrid } from "../models/MapActivity";
import { usePageLoading } from "@/app/contexts/page-loading/usePageLoading";

interface UseActivityGridResult {
    grid: ActivityGrid | null;
    loading: boolean;
}

export const useActivityGrid = (): UseActivityGridResult => {
    const [grid, setGrid] = useState<ActivityGrid | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        RetrieveMapActivitiesService.getActivityGrid().then(({ grid }) => {
            setGrid(grid);
            setLoading(false);
        });
    }, []);

    const pageLoading = usePageLoading(loading);

    return { grid, loading: pageLoading };
};
