import { useEffect, useState } from "react";
import { GroupService } from "@/app/core/service/groups/GroupService";
import { MetalHealthService } from "../services/MetalHealthService";

export interface WellbeingArea {
    label: string;
    value: number;
    color: string;
}

interface UseMentalHealthResult {
    areas: WellbeingArea[];
    balance: number;
    isLoading: boolean;
}

export const useMentalHealth = (): UseMentalHealthResult => {
    const [areas, setAreas] = useState<WellbeingArea[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const { groups, error: groupError } = await GroupService.getAllGroups();
            if (groupError || !groups || groups.length === 0) {
                setIsLoading(false);
                return;
            }

            const { groupPoints, balance: bal, error } = await MetalHealthService.getMentalHealthData(groups);
            if (error) {
                setIsLoading(false);
                return;
            }

            setAreas(groups.map(group => ({
                label: group.name.charAt(0).toUpperCase() + group.name.slice(1),
                value: groupPoints[group.name] ?? 0,
                color: group.color,
            })));
            setBalance(bal);
            setIsLoading(false);
        };
        load();
    }, []);

    return { areas, balance, isLoading };
};
