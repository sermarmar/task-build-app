import { GroupService } from "@/app/core/service/groups/GroupService";
import { Sprout } from "lucide-react";
import { useEffect, useState } from 'react';
import { MetalHealthService } from "../services/MetalHealthService";
import { Card, CardBody } from "@/app/components/ux/Card";
import { DonutChart } from "@/app/components/ux/DonutChart";
import { Skeleton } from "@/app/components/ux/Skeleton";

interface Item {
  label: string;
  value: number;
  color: string;
}

export const MentalHealthBoard: React.FC = () => {

    const [items, setItems] = useState<Item[]>([]);
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

            const mapped: Item[] = groups.map(group => ({
                label: group.name.charAt(0).toUpperCase() + group.name.slice(1),
                value: groupPoints[group.name] ?? 0,
                color: group.color,
            }));

            setItems(mapped);
            setBalance(bal);
            setIsLoading(false);
        };
        load();
    }, []);

    const tabTitle = (
        <div className="flex gap-2">
            <Sprout />
            Salud mental
        </div>
    );

    return (
        <Card tabTitle={tabTitle} className="h-full flex flex-col">
            <CardBody className="mt-5">
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <Skeleton className="w-48 h-48 rounded-full" />
                    </div>
                ) : (
                    <DonutChart items={items} centerText={`${balance}%`} gap={20}/>
                )}
            </CardBody>
        </Card>
    );
}