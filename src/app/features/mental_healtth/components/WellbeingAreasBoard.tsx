import { HeartPulse } from "lucide-react";
import { Card } from "@/app/components/ux/Card";
import { SkeletonLine } from "@/app/components/ux/Skeleton";
import type { WellbeingArea } from "../hooks/useMentalHealth";

interface WellbeingAreasBoardProps {
    areas: WellbeingArea[];
    isLoading: boolean;
}

export const WellbeingAreasBoard: React.FC<WellbeingAreasBoardProps> = ({ areas, isLoading }) => {
    const max = Math.max(...areas.map(a => a.value), 1);

    const tabTitle = (
        <>
            <HeartPulse />
            Áreas de bienestar
        </>
    );

    return (
        <Card tabTitle={tabTitle} tabSubtitle="Puntos ganados por área">
            {isLoading ? (
                <div className="flex flex-col gap-5 pt-2">
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonLine key={i} className="w-full h-6" />)}
                </div>
            ) : (
                <ul className="flex flex-col gap-4 pt-1">
                    {areas.map(area => (
                        <li key={area.label}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                                <span className="font-bold text-primary-800">{area.label}</span>
                                <span className="font-bold text-primary-500 tabular-nums">{Math.round(area.value)} pts</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-primary-100/70 shadow-clay-inset overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-[width] duration-500"
                                    style={{
                                        width: `${(area.value / max) * 100}%`,
                                        background: `linear-gradient(90deg, ${area.color}99, ${area.color})`,
                                    }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
};
