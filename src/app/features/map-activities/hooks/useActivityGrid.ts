import { useEffect, useState } from "react";
import { RetrieveMapActivitiesService } from "../services/RetrieveMapActivitiesService";
import type { ActivityGrid } from "../models/MapActivity";

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

    return { grid, loading };
};
