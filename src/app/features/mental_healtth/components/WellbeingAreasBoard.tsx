import { HeartPulse } from "lucide-react";
import { Card } from "@/app/components/ux/Card";
import { DynamicIcon } from "@/app/components/ux/DynamicIcon";
import { Skeleton, SkeletonLine } from "@/app/components/ux/Skeleton";
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
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="size-10 rounded-2xl shrink-0" />
                            <SkeletonLine className="flex-1 h-6" />
                        </div>
                    ))}
                </div>
            ) : (
                <ul className="flex flex-col gap-4 pt-1">
                    {areas.map(area => (
                        <li key={area.label} className="flex items-center gap-3">
                            <span
                                className="size-10 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-clay-pressed"
                                style={{ background: `linear-gradient(160deg, ${area.color}aa, ${area.color})` }}
                            >
                                <DynamicIcon name={area.icon} size={20} />
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between text-sm mb-1.5">
                                    <span className="font-bold text-primary-800 truncate">{area.label}</span>
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
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
};
