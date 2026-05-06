import { CategoryService } from "@/app/core/service/categories/CategoryService";
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
            const { categories } = await CategoryService.getAllCategories();
            if (!categories) return;

            // Mapa categoría → grupo
            const categoryToGroup: Record<string, { name: string; color: string }> = {};
            const groupsMap: Record<string, { name: string; color: string }> = {};

            categories.forEach(cat => {
                if (cat.group) {
                    categoryToGroup[cat.name] = cat.group;
                    groupsMap[cat.group.name] = cat.group;
                }
            });

            const totalGroups = Object.keys(groupsMap).length;

            const { points, balance: bal, error } = await MetalHealthService.getMentalHealthData(totalGroups);
            if (error) {
                console.error('Error fetching mental health data:', error);
                return;
            }

            if (points) {
                // Agregar puntos por grupo
                const groupPoints: Record<string, number> = {};
                Object.entries(points).forEach(([catName, value]) => {
                    const group = categoryToGroup[catName];
                    if (group) {
                        groupPoints[group.name] = (groupPoints[group.name] ?? 0) + value;
                    }
                });

                const mapped: Item[] = Object.entries(groupsMap).map(([groupName, group]) => ({
                    label: groupName.charAt(0).toUpperCase() + groupName.slice(1),
                    value: groupPoints[groupName] ?? 0,
                    color: group.color,
                }));

                setItems(mapped);
                setBalance(bal);
            }
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