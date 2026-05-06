import { GroupService } from "@/app/core/service/groups/GroupService";
import { Leaf } from "lucide-react";
import { useEffect, useState } from 'react';
import { MetalHealthService } from "../services/MetalHealthService";
import { Card, CardBody, CardTitle } from "@/app/components/ux/Card";
import { DonutChart } from "@/app/components/ux/DonutChart";

interface Item {
  label: string;
  value: number;
  color: string;
}

export const MentalHealthBoard: React.FC = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        const load = async () => {
            const { groups, error: groupError } = await GroupService.getAllGroups();
            if (groupError || !groups || groups.length === 0) return;

            const { groupPoints, balance: bal, error } = await MetalHealthService.getMentalHealthData(groups);
            if (error) return;

            const mapped: Item[] = groups.map(group => ({
                label: group.name.charAt(0).toUpperCase() + group.name.slice(1),
                value: groupPoints[group.name] ?? 0,
                color: group.color,
            }));

            setItems(mapped);
            setBalance(bal);
        };
        load();
    }, []);

    return (
        <Card className="h-full flex flex-col">
            <CardTitle className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <Leaf />
                    Salud mental
                </div>
            </CardTitle>
            <CardBody className="mt-5">
                <DonutChart items={items} centerText={`${balance}%`} gap={20}/>
            </CardBody>
        </Card>
    );
}