
import { Leaf } from "lucide-react";
import { Card, CardBody, CardTitle } from "../../components/ux/Card";
import { CategoryService } from '../../core/service/categories/CategoryService';
import { useEffect, useState } from 'react';
import type { Category } from '../../core/models/Category';
import { RadarChart } from '../../components/ux/RadarChart';
import { MetalHealthService } from "./services/MetalHealthService";



export const MentalHealthBoard: React.FC = () => {

    const [pointsData, setPointsData] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        Promise.all([
            CategoryService.getAllCategories(),
            MetalHealthService.getMentalHealthData()
        ]).then(([{ categories }, { points, error }]) => {
            if (error) {
                console.error('Error fetching mental health data:', error);
                return;
            }
            if (categories && points) {
                const filtered = categories.reduce((acc: { [key: string]: number }, category: Category) => {
                    acc[category.name] = points[category.name] ?? 0;  // si no existe, 0
                    return acc;
                }, {});
                setPointsData(filtered);
            }
        });
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
                <RadarChart data={pointsData} />
            </CardBody>
        </Card>
    );
}